# 시스템 아키텍처

## 📋 개요

이 프로젝트는 **NestJS 백엔드**와 **Next.js 프론트엔드**를 활용한 **이벤트 기반 실시간 통신 시스템**입니다.
Turborepo를 사용한 모노레포 구조로, SSE(Server-Sent Events)와 EventEmitter를 통해 실시간 데이터 전송을 구현했습니다.

## 🏗️ 전체 구조

```
nestjs-nextjs-event-driven/
├── apps/
│   ├── backend/          # NestJS 백엔드 (포트 3000)
│   │   ├── src/
│   │   │   ├── accounts/     # 계정 관리 모듈
│   │   │   ├── events/       # SSE 이벤트 스트림 모듈
│   │   │   ├── snapshots/    # 스냅샷 생성 모듈
│   │   │   └── main.ts       # 애플리케이션 진입점
│   │   └── package.json
│   └── web/             # Next.js 프론트엔드 (포트 3001)
│       ├── app/
│       │   ├── events/       # 이벤트 관련 훅
│       │   ├── page.tsx      # 메인 페이지
│       │   └── layout.tsx
│       └── package.json
├── packages/            # 공유 패키지
│   ├── eslint-config/   # ESLint 설정
│   └── typescript-config/ # TypeScript 설정
└── turbo.json          # Turborepo 설정
```

## 🎯 핵심 기술 스택

### 백엔드 (NestJS)

- **`@nestjs/event-emitter`**: 내부 이벤트 시스템 관리
- **RxJS**: 리액티브 스트림 및 비동기 데이터 처리
- **SSE (Server-Sent Events)**: 실시간 클라이언트 통신
- **TypeScript**: 타입 안전성 보장

### 프론트엔드 (Next.js)

- **EventSource API**: SSE 연결 관리
- **React Hooks**: 이벤트 구독 및 상태 관리
- **TypeScript**: 타입 안전성 보장

### 개발 도구

- **Turborepo**: 모노레포 빌드 시스템
- **ESLint & Prettier**: 코드 품질 관리

## 🔧 주요 모듈 구조

### 1. EventsModule

**역할**: SSE 연결 관리 및 실시간 스트림 제공

```typescript
@Module({
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
```

**주요 기능**:

- 사용자별 독립적인 SSE 스트림 관리
- RxJS Observable을 통한 실시간 데이터 스트림
- Keep-alive 신호로 연결 안정성 보장 (25초 간격)
- 연결 해제 시 자동 리소스 정리

### 2. AccountsModule

**역할**: 계정 생성 및 관리

```typescript
@Module({
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
```

**주요 기능**:

- 계정 생성 REST API 제공
- 계정 생성 시 자동으로 스냅샷 생성 이벤트 발생
- EventEmitter2를 통한 내부 이벤트 발행

### 3. SnapshotsModule

**역할**: 이벤트 리스너 및 스냅샷 생성 로직

```typescript
@Module({
  providers: [SnapshotsService],
  controllers: [SnapshotsController],
})
export class SnapshotsModule {}
```

**주요 기능**:

- `@OnEvent` 데코레이터를 통한 이벤트 리스닝
- 비동기 스냅샷 생성 처리
- 처리 완료 후 클라이언트 알림

## 🔄 이벤트 기반 아키텍처 패턴

### 1. 이벤트 발행-구독 패턴

```typescript
// 이벤트 발행
this.eventEmitter.emit('snapshots.generate', new GenerateSnapshotsEvent('123'));

// 이벤트 구독
@OnEvent('snapshots.generate')
generateSnapshots(event: GenerateSnapshotsEvent) {
  // 처리 로직
}
```

### 2. 실시간 스트림 패턴

```typescript
// RxJS를 활용한 스트림 관리
return merge(userStream.asObservable(), keepAlive$).pipe(
  finalize(() => {
    console.log(`🚩 User ${userId} disconnected`);
    this.userStreams.delete(userId);
  }),
);
```

### 3. 클라이언트 이벤트 구독 패턴

```typescript
// React Hook을 통한 이벤트 구독
useEvents(['snapshots.generated'], (eventType) => {
  console.log(`✅ [${eventType}] event received`);
});
```

## 🌟 아키텍처의 장점

### 1. **확장성 (Scalability)**

- 모듈별 독립적인 구조로 새로운 기능 추가 용이
- 이벤트 기반으로 서비스 간 느슨한 결합

### 2. **실시간성 (Real-time)**

- SSE를 통한 즉각적인 클라이언트 알림
- WebSocket 대비 간단한 구현으로 실시간 통신 달성

### 3. **비동기 처리 (Asynchronous)**

- 계정 생성과 스냅샷 생성의 비동기 분리
- 사용자 경험 향상을 위한 논블로킹 처리

### 4. **유지보수성 (Maintainability)**

- 각 모듈이 단일 책임 원칙 준수
- TypeScript를 통한 타입 안전성 보장

### 5. **리소스 효율성 (Resource Efficiency)**

- 사용자별 스트림으로 효율적인 메모리 관리
- 연결 해제 시 자동 정리로 메모리 누수 방지

## 🔍 성능 고려사항

### 1. **연결 관리**

- 사용자별 독립적인 스트림으로 격리
- finalize 오퍼레이터를 통한 자동 리소스 정리

### 2. **Keep-alive 메커니즘**

- 25초 간격으로 keep-alive 신호 전송
- 네트워크 연결 안정성 보장

### 3. **메모리 최적화**

- Map 자료구조를 통한 효율적인 스트림 관리
- 연결 해제 시 즉시 메모리에서 제거

## 🚀 확장 가능성

### 1. **다중 이벤트 타입 지원**

- 새로운 이벤트 타입 추가 시 기존 코드 영향 최소화
- 이벤트 네이밍 컨벤션을 통한 체계적 관리

### 2. **인증 및 권한 관리**

- 사용자별 스트림 구조로 권한 기반 이벤트 필터링 가능
- JWT 토큰을 통한 보안 강화 확장 가능

### 3. **메시지 큐 통합**

- Redis나 RabbitMQ 등과 연동하여 분산 시스템 확장 가능
- 이벤트 영속성 및 재시도 메커니즘 추가 가능

## 📊 모니터링 및 로깅

현재 구현된 로깅:

```typescript
console.log(`🚩 User ${userId} disconnected`);
```

향후 확장 가능한 모니터링:

- 연결 수 모니터링
- 이벤트 처리 성능 메트릭
- 에러 추적 및 알림 시스템
