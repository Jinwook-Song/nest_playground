# NestJS-NextJS Redis 기반 분산 실시간 통신 시스템

이 프로젝트는 **Redis Pub/Sub**을 활용한 확장 가능한 분산 실시간 통신 시스템입니다.

## 📚 문서 목록

- [아키텍처 개요](./architecture.md) - Redis 기반 분산 시스템 구조와 설계 패턴
- [API 문서](./api.md) - REST API 엔드포인트 및 SSE 스트림 문서 (다중 서버 지원)
- [이벤트 플로우](./event-flow.md) - Redis Pub/Sub 기반 이벤트 통신 흐름 상세 설명

## 🚀 빠른 시작

### **필수 요구사항**

- Node.js 18+
- Docker (Redis 실행용)
- npm 또는 yarn

### **방법 1: Turbo + Redis (권장)**

#### 1. 프로젝트 설정

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp env.example apps/backend/.env
# apps/backend/.env 파일 내용:
# REDIS_HOST=localhost
# REDIS_PORT=6379
# SERVER_ID=backend-1
# PORT=3000
```

#### 2. Redis 실행

```bash
# Redis 컨테이너 실행
docker run -d --name redis-server -p 6379:6379 redis:alpine

# Redis 정상 동작 확인
docker exec redis-server redis-cli ping
# 응답: PONG
```

#### 3. 개발 서버 실행

```bash
# 프론트엔드 + 백엔드 동시 실행
npm run dev
# 또는
turbo dev
```

#### 4. 접속 확인

- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:3000
- **SSE 스트림**: http://localhost:3000/events/sse

### **방법 2: 다중 서버 환경 (분산 테스트)**

#### 1. 기본 설정 (위와 동일)

```bash
npm install
cp env.example apps/backend/.env
docker run -d --name redis-server -p 6379:6379 redis:alpine
```

#### 2. 첫 번째 서버 실행

```bash
# 터미널 1
cd apps/backend
npm run dev
# 실행: localhost:3000
```

#### 3. 두 번째 서버 실행

```bash
# 터미널 2
cd apps/backend
SERVER_ID=backend-2 PORT=3002 npm run start:debug
# 실행: localhost:3002
```

#### 4. 프론트엔드 실행

```bash
# 터미널 3
cd apps/web
npm run dev
# 실행: localhost:3001
```

#### 5. 다중 서버 테스트

```bash
# 터미널 4: 서버1 SSE 연결
curl -N http://localhost:3000/events/sse

# 터미널 5: 서버2에서 계정 생성
curl -X POST http://localhost:3002/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"다중서버테스트","balance":999999}'

# 결과: 터미널 4에서 실시간 이벤트 수신! ✅
```

### **방법 3: Docker Compose (전체 환경)**

#### 1. 전체 환경 실행

```bash
# 모든 서비스 실행 (Redis + 백엔드 2대 + Nginx)
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

#### 2. 로드밸런서를 통한 테스트

```bash
# Nginx 로드밸런서 통해 접속
curl -N http://localhost:80/events/sse &
curl -X POST http://localhost:80/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"로드밸런싱테스트","balance":777777}'
```

## 🛑 종료 방법

### **Turbo 환경 종료**

```bash
# 1. 개발 서버 종료 (Ctrl+C 또는)
pkill -f "turbo dev"
pkill -f "npm run dev"

# 2. Redis 컨테이너 종료
docker stop redis-server
docker rm redis-server
```

### **다중 서버 환경 종료**

```bash
# 1. 모든 Node.js 프로세스 종료
pkill -f "npm run dev"
pkill -f "npm run start"
pkill -f node

# 2. Redis 종료
docker stop redis-server && docker rm redis-server
```

### **Docker Compose 환경 종료**

```bash
# 모든 컨테이너 및 네트워크 정리
docker-compose down

# 볼륨까지 완전 삭제
docker-compose down -v
```

### **완전 초기화**

```bash
# 모든 프로세스 및 컨테이너 정리
pkill -f node
docker ps -q | xargs -r docker stop
docker ps -aq | xargs -r docker rm
docker volume prune -f
docker network prune -f
```

## 🧪 기능 테스트

### **웹 인터페이스 테스트**

1. http://localhost:3001 접속
2. "🏦 새 계정 생성" 버튼 클릭
3. 실시간 이벤트 상태 메시지 확인
4. 개발자 도구 Console에서 상세 로그 확인

### **API 직접 테스트**

```bash
# SSE 연결
curl -N http://localhost:3000/events/sse

# 계정 생성 (다른 터미널에서)
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"API테스트","balance":123456}'
```

### **Redis 모니터링**

```bash
# Redis CLI 접속
docker exec -it redis-server redis-cli

# 실시간 모니터링
MONITOR

# 채널 구독자 확인
PUBSUB NUMSUB user-events
```

## 🛠️ 기술 스택

### **백엔드**

- **NestJS**: Node.js 프레임워크
- **Redis**: 분산 메시지 브로커 (Pub/Sub)
- **ioredis**: Redis 클라이언트 라이브러리
- **RxJS**: 리액티브 스트림
- **SSE**: 실시간 클라이언트 통신

### **프론트엔드**

- **Next.js**: React 프레임워크
- **EventSource API**: SSE 클라이언트
- **TypeScript**: 타입 안전성

### **인프라**

- **Docker**: Redis 컨테이너
- **Nginx**: 로드밸런서 (선택사항)
- **Turborepo**: 모노레포 빌드

## 🌟 핵심 특징

### **확장성**

- ✅ 백엔드 서버 무제한 추가 가능
- ✅ Redis를 통한 자동 이벤트 동기화
- ✅ 로드밸런서 지원

### **고가용성**

- ✅ 단일 서버 장애 시에도 서비스 계속 운영
- ✅ 자동 장애 복구
- ✅ Redis 클러스터링 지원 가능

### **실시간성**

- ✅ Redis 메모리 기반 < 1ms 지연시간
- ✅ SSE를 통한 즉각적인 클라이언트 알림
- ✅ Keep-alive로 연결 안정성 보장

## 📊 시스템 구조

```
클라이언트 (브라우저)
    ↓
Next.js (프론트엔드) :3001
    ↓
로드밸런서 (Nginx) - 선택사항
    ↓
├─ Backend 1 (:3000) ←┐
├─ Backend 2 (:3002) ←┼→ Redis Pub/Sub
└─ Backend N (:300N) ←┘    (:6379)
```

## 🔧 트러블슈팅

### **Redis 연결 오류**

```bash
# Redis 상태 확인
docker ps | grep redis
docker logs redis-server

# Redis 재시작
docker restart redis-server
```

### **포트 충돌**

```bash
# 포트 사용 확인
lsof -i :3000 -i :3001 -i :6379

# 프로세스 종료
pkill -f "port 3000"
```

### **환경변수 문제**

```bash
# .env 파일 확인
cat apps/backend/.env

# 환경변수 직접 설정
REDIS_HOST=localhost SERVER_ID=backend-1 npm run dev
```

## 📈 성능 최적화

### **Redis 최적화**

- 메모리 사용량 모니터링
- 연결 풀링 설정
- 메시지 크기 제한

### **네트워크 최적화**

- Keep-alive 간격 조정 (현재 15초)
- 압축 설정
- CDN 활용 (프로덕션)

## 🔮 향후 확장 계획

### **인증 시스템**

- JWT 토큰 기반 인증
- 사용자별 권한 관리
- OAuth 통합

### **모니터링**

- Prometheus + Grafana
- 이벤트 처리 메트릭
- 성능 대시보드

### **클라우드 배포**

- Kubernetes 환경
- Redis Cluster
- 오토스케일링

## 💡 참고사항

- **개발 환경**: Redis만 Docker, 나머지는 로컬 실행
- **프로덕션**: 모든 구성요소 컨테이너화 권장
- **모니터링**: Redis CLI 명령어로 실시간 상태 확인 가능
- **확장**: 서버 추가 시 환경변수(SERVER_ID, PORT)만 변경하면 됨

이제 완전한 분산 실시간 통신 시스템을 경험해보세요! 🚀
