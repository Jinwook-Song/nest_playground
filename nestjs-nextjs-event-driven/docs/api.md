# API 문서

## 📋 개요

이 문서는 NestJS 백엔드에서 제공하는 REST API 엔드포인트와 SSE(Server-Sent Events) 스트림에 대한 상세 정보를 제공합니다.

## 🚀 베이스 URL

- **개발 환경**: `http://localhost:3000`
- **프로덕션**: 배포 환경에 따라 설정

## 📡 REST API 엔드포인트

### 계정 관리 (Accounts)

#### POST /accounts

새로운 계정을 생성합니다.

**요청**

```http
POST /accounts
Content-Type: application/json

{
  "name": "사용자 이름",
  "balance": 1000000
}
```

**요청 본문 스키마**

```typescript
interface CreateAccountRequest {
  name: string; // 계정 소유자 이름
  balance: number; // 초기 잔액
}
```

**응답**

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "name": "사용자 이름",
  "balance": 1000000
}
```

**부수 효과**

- 계정 생성 후 자동으로 `snapshots.generate` 이벤트가 발생
- 연결된 클라이언트에게 `snapshots.generated` 이벤트가 실시간 전송

**예제**

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "balance": 1000000
  }'
```

## 📊 Server-Sent Events (SSE)

### GET /events/sse

실시간 이벤트 스트림에 연결합니다.

**요청**

```http
GET /events/sse
Accept: text/event-stream
Cache-Control: no-cache
```

**응답 헤더**

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *
```

**이벤트 스트림 형식**

```
data: {"eventType":"snapshots.generated","...추가데이터"}

data: {"comment":"keep-alive"}
```

**이벤트 타입**

#### 1. snapshots.generated

스냅샷 생성이 완료되었을 때 발생하는 이벤트

```json
{
  "eventType": "snapshots.generated"
}
```

#### 2. keep-alive

연결 유지를 위한 주기적 신호 (25초 간격)

```json
{
  "comment": "keep-alive"
}
```

**클라이언트 연결 예제**

```javascript
const eventSource = new EventSource('http://localhost:3000/events/sse');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('받은 이벤트:', data);
};

eventSource.onerror = (error) => {
  console.error('SSE 연결 오류:', error);
};

// 연결 종료
eventSource.close();
```

## 🔧 기술적 세부사항

### 인증

현재 구현에서는 인증을 사용하지 않습니다. 모든 사용자는 동일한 userId(`'123'`)로 처리됩니다.

### CORS 설정

기본적으로 모든 도메인에서의 접근을 허용합니다.

### 오류 처리

#### 일반적인 HTTP 오류 코드

- `400 Bad Request`: 잘못된 요청 형식
- `500 Internal Server Error`: 서버 내부 오류

#### SSE 연결 오류

- 연결이 끊어진 경우 클라이언트는 자동으로 재연결을 시도
- 서버에서는 연결 해제 시 리소스를 자동으로 정리

## 📈 성능 특성

### REST API

- **응답 시간**: 일반적으로 10ms 이하
- **동시 연결**: Node.js 이벤트 루프 기반으로 높은 동시성 지원

### SSE 스트림

- **연결 유지**: Keep-alive 메커니즘으로 안정적인 연결 보장
- **메모리 사용**: 사용자별 독립적인 스트림으로 효율적 관리
- **지연 시간**: 실시간 이벤트 전송 (< 100ms)

## 🧪 테스트 시나리오

### 1. 계정 생성 → 실시간 알림 플로우

1. **SSE 연결 설정**

```javascript
const eventSource = new EventSource('http://localhost:3000/events/sse');
eventSource.onmessage = (event) => {
  console.log('이벤트 수신:', JSON.parse(event.data));
};
```

2. **계정 생성 API 호출**

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트계정","balance":50000}'
```

3. **예상 결과**

- API 응답으로 계정 정보 반환
- SSE 스트림으로 `snapshots.generated` 이벤트 수신

### 2. Keep-alive 테스트

SSE 연결을 유지하고 25초마다 keep-alive 메시지 수신 확인:

```javascript
const eventSource = new EventSource('http://localhost:3000/events/sse');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.comment === 'keep-alive') {
    console.log('Keep-alive 신호 수신:', new Date());
  }
};
```

## 🔮 향후 확장 계획

### 인증 시스템

```http
Authorization: Bearer <JWT_TOKEN>
```

### 사용자별 스트림

```http
GET /events/sse/:userId
```

### 추가 이벤트 타입

- `account.created`
- `account.updated`
- `account.deleted`
- `balance.changed`

### 웹훅 지원

```http
POST /webhooks/register
{
  "url": "https://client.example.com/webhook",
  "events": ["snapshots.generated"]
}
```
