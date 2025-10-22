# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NestJS 기반 **헥사고날 아키텍처(Ports & Adapters)**와 **CQRS(Command Query Responsibility Segregation)** 패턴을 결합한 연습용 프로젝트입니다. `@nestjs/cqrs` 패키지를 사용하여 구현되었습니다.

## 개발 명령어

### 애플리케이션 실행
```bash
# 개발 모드 (watch)
pnpm run dev

# 일반 개발 모드
pnpm run start

# 디버그 모드
pnpm run start:debug

# 프로덕션 모드
pnpm run start:prod
```

### 빌드 & 포맷팅
```bash
# 프로젝트 빌드
pnpm run build

# 코드 포맷팅
pnpm run format

# 린트 및 자동 수정
pnpm run lint
```

### 테스트
```bash
# 모든 유닛 테스트 실행
pnpm run test

# Watch 모드로 테스트
pnpm run test:watch

# 커버리지 리포트 포함
pnpm run test:cov

# E2E 테스트
pnpm run test:e2e

# 테스트 디버깅
pnpm run test:debug
```

## 아키텍처 구조

### 핵심 아키텍처 원칙

이 프로젝트는 **의존성 규칙(Dependency Rule)**을 엄격히 준수합니다:
- **내부 레이어(domain)**는 외부 레이어에 대한 의존성이 전혀 없음
- **외부 레이어(infrastructure, presentation)**는 내부를 향해서만 의존
- 모든 외부 의존성은 **Port(인터페이스)**를 통해 추상화

### 레이어 구조 (안쪽에서 바깥쪽으로)

```
src/
├── user/                              # Bounded Context (도메인 단위)
│   ├── domain/                        # 핵심 비즈니스 로직 (최내부 레이어)
│   │   ├── entities/                  # 애그리거트 루트
│   │   │   └── user.entity.ts        # AggregateRoot 상속, 비즈니스 로직 포함
│   │   ├── value-objects/             # 불변 도메인 객체
│   │   │   ├── user-id.vo.ts         # UUID 기반 타입 안전 ID
│   │   │   └── email.vo.ts           # 검증 로직 포함 이메일
│   │   └── events/                    # 도메인 이벤트
│   │       └── user-created.event.ts  # 사용자 생성 시 발행
│   │
│   ├── application/                   # 유즈케이스 & 애플리케이션 로직
│   │   ├── commands/                  # 쓰기 작업 (CQRS)
│   │   │   ├── create-user.command.ts
│   │   │   ├── update-user.command.ts
│   │   │   ├── delete-user.command.ts
│   │   │   └── handlers/              # 커맨드 핸들러
│   │   │       ├── create-user.handler.ts  # EventPublisher로 이벤트 발행
│   │   │       ├── update-user.handler.ts
│   │   │       ├── delete-user.handler.ts
│   │   │       └── index.ts           # CommandHandlers 배열 export
│   │   ├── queries/                   # 읽기 작업 (CQRS)
│   │   │   ├── get-user.query.ts
│   │   │   ├── list-users.query.ts
│   │   │   └── handlers/              # 쿼리 핸들러
│   │   │       ├── get-user.handler.ts
│   │   │       ├── list-users.handler.ts
│   │   │       └── index.ts           # QueryHandlers 배열 export
│   │   ├── events/                    # 애플리케이션 이벤트 핸들러
│   │   │   ├── user-created.handler.ts # UserCreatedEvent 처리
│   │   │   └── index.ts               # EventHandlers 배열 export
│   │   └── ports/                     # 인터페이스 (헥사고날 아키텍처)
│   │       ├── user.repository.port.ts      # 저장소 인터페이스 + DI 토큰
│   │       └── email-notification.port.ts   # 이메일 서비스 인터페이스 + DI 토큰
│   │
│   ├── infrastructure/                # 외부 기술 구현 (최외부 레이어)
│   │   └── adapters/                  # Port 구현체
│   │       ├── in-memory-user.repository.ts # UserRepositoryPort 구현
│   │       └── console-email.adapter.ts     # EmailNotificationPort 구현
│   │
│   ├── presentation/                  # API 레이어
│   │   └── user.controller.ts        # CommandBus & QueryBus 사용
│   │
│   └── user.module.ts                # NestJS 모듈 (의존성 주입 설정)
│
├── app.module.ts                     # 루트 모듈 (CqrsModule 임포트)
└── main.ts                           # 애플리케이션 진입점
```

## 핵심 패턴 상세 설명

### 1. 헥사고날 아키텍처 (Ports & Adapters)

**Port (인터페이스)** - 외부 의존성과의 계약:
```typescript
// application/ports/user.repository.port.ts
export interface UserRepositoryPort {
  save(user: User): Promise<User> | User;
  findById(id: string): Promise<User | null> | User | null;
  // ...
}
export const USER_REPOSITORY = Symbol('USER_REPOSITORY'); // DI 토큰
```

**Adapter (구현체)** - 특정 기술에 대한 구현:
```typescript
// infrastructure/adapters/in-memory-user.repository.ts
@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();
  // ... 구현
}
```

**의존성 주입 설정**:
```typescript
// user.module.ts
providers: [
  {
    provide: USER_REPOSITORY,           // Symbol 토큰 사용
    useClass: InMemoryUserRepository,   // 쉽게 교체 가능 (TypeORM, Prisma 등)
  }
]
```

### 2. CQRS 패턴

**Command (쓰기)**와 **Query (읽기)**를 명확히 분리:

- **CommandBus**: 상태 변경 작업을 핸들러로 라우팅
- **QueryBus**: 읽기 전용 작업을 핸들러로 라우팅
- **EventBus**: 상태 변경 후 도메인 이벤트 발행

**사용자 생성 플로우 예시**:
```
1. Controller가 HTTP POST 요청 수신
   ↓
2. CreateUserCommand 생성 → CommandBus.execute()
   ↓
3. CreateUserHandler가 처리:
   - Repository로 이메일 중복 검증
   - User.create() 팩토리 메서드 호출
   - 도메인 엔티티가 UserCreatedEvent 적용
   ↓
4. EventPublisher.mergeObjectContext()로 이벤트 버스 연결
   ↓
5. commit() 호출 → UserCreatedHandler 실행
   ↓
6. EmailNotificationPort를 통해 활성화 이메일 발송
```

**Controller에서 사용 예시**:
```typescript
@Post()
async createUser(@Body() request: CreateUserCommand) {
  const command = new CreateUserCommand(request.name, request.email);
  const user = await this.commandBus.execute<CreateUserCommand, User>(command);
  return this.mapUserToResponse(user);
}
```

### 3. 도메인 주도 설계 (DDD) 요소

**Entity (엔티티)** - `user.entity.ts`:
- `AggregateRoot` 상속 (`@nestjs/cqrs`)
- 비즈니스 로직 캡슐화 (검증, 계산)
- `apply()` 메서드로 도메인 이벤트 큐잉
- 팩토리 메서드 `User.create()`로 유효한 객체 생성 보장

```typescript
static create(name: string, email: string) {
  // 검증 로직
  const user = new User(new UserId(), name.trim(), new Email(email), ...);
  user.apply(new UserCreatedEvent(...)); // 이벤트 적용
  return user;
}
```

**Value Object (값 객체)** - `email.vo.ts`, `user-id.vo.ts`:
- 불변 타입, 생성 시 검증
- 동등성은 식별자가 아닌 값 기준
- 도메인 규칙 캡슐화 (예: 이메일 형식)

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) throw new Error('Invalid email format');
    this.value = email;
  }

  equals(other: Email) {
    return this.value === other.value; // 값 기반 비교
  }
}
```

**Domain Event (도메인 이벤트)** - `user-created.event.ts`:
- 도메인에서 발생한 사실을 표현
- 결합 없이 사이드 이펙트 트리거 (이메일 발송 등)

```typescript
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    await this.emailNotificationService.sendActivationEmail(...);
  }
}
```

## 새로운 기능 추가 가이드

### 새로운 Bounded Context 추가 시 (예: `product/`, `order/`)

1. **디렉토리 구조 생성** - `user/` 구조 참고
2. **Domain 레이어**: Entity, Value Object, Event 먼저 정의
3. **Application 레이어**:
   - Port(인터페이스) 정의
   - Command/Query DTO 생성
   - Handler 구현 (도메인 로직 오케스트레이션)
4. **Infrastructure 레이어**: Port의 Adapter 구현
5. **Presentation 레이어**: CommandBus/QueryBus 사용하는 Controller
6. **Module**: DI 토큰으로 의존성 연결

### 기존 Context에 작업 추가 시

- **쓰기 작업** → Command + CommandHandler 생성
- **읽기 작업** → Query + QueryHandler 생성
- **사이드 이펙트** → DomainEvent + EventHandler 생성
- **외부 의존성** → Port + Adapter 생성

## 중요한 컨벤션

### 의존성 방향
- Domain 레이어: 의존성 ZERO (순수 비즈니스 로직)
- Application 레이어: Domain만 의존
- Infrastructure/Presentation: Application의 인터페이스(Port)에만 의존

### 이벤트 발행 패턴
```typescript
// Command Handler에서 반드시 EventPublisher 사용
const user = User.create(name, email);
const userWithEvents = this.publisher.mergeObjectContext(user);
userWithEvents.commit();  // 이벤트 핸들러 트리거
```

### Repository 패턴
- Repository는 DTO가 아닌 도메인 Entity를 다룸
- Port는 application 레이어에서 정의
- Adapter는 infrastructure 레이어에서 구현
- 현재는 in-memory 저장소 (TypeORM/Prisma로 쉽게 교체 가능)

### Value Object 사용
- 원시 타입 대신 `UserId`, `Email` 사용
- `getValue()`로 값 접근
- `equals()`로 비교 수행

이 아키텍처는 **테스트 용이성**(Port 모킹), **유지보수성**(명확한 경계), **유연성**(비즈니스 로직 변경 없이 Adapter 교체)을 보장합니다.
