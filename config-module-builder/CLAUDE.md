# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 리포지토리에서 작업할 때 필요한 가이드를 제공합니다.

## 프로젝트 개요

NestJS의 설정 가능한 모듈(Configurable Module) 패턴을 시연하는 모노레포입니다. `ConfigurableModuleBuilder` 패턴을 사용하여 재사용 가능하고 설정 가능한 모듈을 구축하는 방법을 보여줍니다.

## 아키텍처

### 모노레포 구조
- **`apps/config-module-builder/`** - 설정 가능한 모듈 사용법을 보여주는 메인 애플리케이션
- **`apps/main/`** - 보조 애플리케이션
- **`libs/common/`** - 설정 가능한 모듈 구현이 포함된 공유 라이브러리

### 주요 컴포넌트

#### Common 라이브러리 (`libs/common/`)
설정 가능한 모듈 패턴의 핵심 라이브러리입니다:
- **`CommonModuleOptions`** - 모듈 설정 옵션을 정의하는 인터페이스 (현재는 `url: string`만 있음)
- **`common.module-definition.ts`** - NestJS `ConfigurableModuleBuilder`를 사용해서 기본 설정 가능한 모듈 클래스를 생성
- **`CommonModule`** - `ConfigurableModuleClass`를 상속받는 실제 모듈
- **`CommonService`** - 설정된 옵션을 사용하는 서비스

#### 모듈 임포트 패턴
메인 앱에서는 의존성 주입과 함께 비동기 모듈 등록을 보여줍니다:
```typescript
CommonModule.registerAsync({
  useFactory: (configService: ConfigService) => ({
    url: configService.getOrThrow('URL_CONFIG'),
  }),
  inject: [ConfigService],
})
```

## 개발 명령어

### 패키지 매니저
이 프로젝트는 `pnpm`을 패키지 매니저로 사용합니다.

### 설치
```bash
pnpm install
```

### 개발
```bash
# 개발 모드 (파일 변경 감지)
pnpm run start:dev

# 디버깅 모드
pnpm run start:debug

# 프로덕션 빌드 및 실행
pnpm run build
pnpm run start:prod
```

### 테스트
```bash
# 단위 테스트
pnpm run test

# 단위 테스트 (파일 변경 감지)
pnpm run test:watch

# E2E 테스트
pnpm run test:e2e

# 테스트 커버리지
pnpm run test:cov

# 테스트 디버깅
pnpm run test:debug
```

### 코드 품질
```bash
# 린트 및 자동 수정
pnpm run lint

# 코드 포맷팅
pnpm run format
```

## 모듈 시스템

### 경로 매핑
깔끔한 임포트를 위해 경로 매핑을 사용합니다:
- `@app/common` → `libs/common/src`

### 새로운 설정 옵션 추가하기
설정 가능한 모듈을 확장할 때:
1. `libs/common/src/common-module-options.interface.ts`의 `CommonModuleOptions` 인터페이스 업데이트
2. 주입된 `MODULE_OPTIONS_TOKEN`을 통해 새로운 옵션을 사용하도록 서비스 수정
3. 새로운 설정을 제공하도록 사용하는 애플리케이션 업데이트

## 중요 사항

- 재사용 가능한 라이브러리 구축을 위한 NestJS 설정 가능한 모듈 패턴을 시연
- 환경 변수는 필수 값에 대해 `ConfigService.getOrThrow()`를 통해 접근
- 모노레포 설정으로 여러 애플리케이션 간에 공통 모듈 공유 가능