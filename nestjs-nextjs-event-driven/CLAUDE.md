# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NestJS 백엔드와 Next.js 프론트엔드 간의 event-driven 통신을 구현한 Turborepo 모노레포 프로젝트입니다.

**핵심 아키텍처:**
- **백엔드(NestJS)**: Event Emitter 기반의 내부 이벤트 시스템 + SSE(Server-Sent Events)를 통한 실시간 통신
- **프론트엔드(Next.js)**: EventSource API를 사용한 SSE 클라이언트 구현
- **통신 방식**: HTTP API + Server-Sent Events를 통한 실시간 이벤트 스트리밍

## 개발 환경 설정

### 필수 요구사항
- Node.js >= 18
- npm 10.5.0

### 프로젝트 실행
```bash
# 전체 프로젝트 개발 서버 실행
npm run dev

# 개별 앱 실행
cd apps/backend && npm run dev  # 포트 3000
cd apps/web && npm run dev      # 포트 3001
```

### 빌드 및 테스트
```bash
# 전체 빌드
npm run build

# 전체 린트
npm run lint

# 타입 체크
npm run check-types

# 백엔드 테스트
cd apps/backend && npm test
cd apps/backend && npm run test:e2e
```

## Event-Driven 아키텍처 구현 상세

### 1. NestJS 백엔드 이벤트 시스템

**EventEmitter 설정** (`src/app.module.ts:8`):
```typescript
@Module({
  imports: [EventEmitterModule.forRoot(), ...],
})
```

**이벤트 발행** (`src/accounts/accounts.service.ts:13-16`):
```typescript
// 계정 생성 시 스냅샷 생성 이벤트 발행
this.eventEmitter.emit('snapshots.generate', new GenerateSnapshotsEvent('123'));
```

**이벤트 구독** (`src/snapshots/snapshots.service.ts:16-28`):
```typescript
@OnEvent('snapshots.generate')
generateSnapshots(event: GenerateSnapshotsEvent) {
  // 스냅샷 생성 로직
  this.eventsService.sendEvent(event.userId, 'snapshots.generated');
}
```

### 2. Server-Sent Events 구현

**SSE 엔드포인트** (`src/events/events.controller.ts:8-11`):
```typescript
@Sse('sse')
sse() {
  return this.eventsService.getEvent$('123');
}
```

**SSE 서비스** (`src/events/events.service.ts`):
- 사용자별 이벤트 스트림 관리 (`userStreams: Map<string, Subject<any>>`)
- Keep-alive 메커니즘 (25초 간격)
- 연결 종료 시 자동 정리

### 3. Next.js 클라이언트 구현

**SSE 클라이언트 훅** (`apps/web/app/events/useEvents.ts`):
```typescript
export function useEvents(eventTypes: string[], callback: (eventType: string) => void) {
  useEffect(() => {
    const eventSource = new EventSource('/api/events/sse');
    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (eventTypes.includes(parsedData.eventType)) {
        callback(parsedData.eventType);
      }
    };
    return () => eventSource.close();
  }, [eventTypes, callback]);
}
```

**API 프록시 설정** (`apps/web/next.config.js:3-9`):
```javascript
async rewrites() {
  return [
    { source: '/api/:path*', destination: `${process.env.API_URL}/:path*` }
  ];
}
```

## 이벤트 플로우 패턴

**계정 생성 → 스냅샷 생성 → 클라이언트 알림 플로우:**

1. **HTTP 요청**: `POST /accounts` → `AccountsController.createAccount()`
2. **내부 이벤트**: `accounts.service.ts` → `EventEmitter.emit('snapshots.generate')`  
3. **이벤트 처리**: `@OnEvent('snapshots.generate')` → `SnapshotsService.generateSnapshots()`
4. **SSE 알림**: `EventsService.sendEvent()` → 클라이언트로 실시간 전송
5. **클라이언트 수신**: `useEvents(['snapshots.generated'])` → 콜백 실행

## 주요 모듈 구조

### 백엔드 모듈
- **AccountsModule**: 계정 관리, 이벤트 발행자 역할
- **SnapshotsModule**: 스냅샷 생성, 이벤트 구독자 역할  
- **EventsModule**: SSE 스트리밍 서비스 제공

### 이벤트 타입
- `snapshots.generate`: 내부 이벤트 (백엔드 모듈 간 통신)
- `snapshots.generated`: SSE 이벤트 (클라이언트 알림)

## 개발 시 주의사항

### 이벤트 네이밍 규칙
- 내부 이벤트: `module.action` (예: `snapshots.generate`)
- SSE 이벤트: `module.past_tense` (예: `snapshots.generated`)

### 하드코딩된 사용자 ID
현재 구현에서는 `userId: '123'`이 하드코딩되어 있음. 실제 구현 시 인증 시스템과 연동 필요.

### SSE 연결 관리
- 클라이언트 연결 종료 시 서버에서 자동으로 스트림 정리
- Keep-alive를 통한 연결 유지 (25초 간격)

### API 프록시 환경변수
`API_URL` 환경변수를 통해 백엔드 서버 URL 설정 (기본값: localhost:3000)

## 확장 가능한 패턴

이 구조는 다음과 같이 확장 가능:
- 여러 이벤트 타입 추가
- 사용자별 개별 이벤트 스트림
- 이벤트 필터링 및 라우팅
- 이벤트 지속성 및 재시도 로직