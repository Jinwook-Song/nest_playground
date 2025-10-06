# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에 대한 가이드를 제공합니다.

## 프로젝트 개요

이 프로젝트는 Turborepo가 어떻게 동작하는지 학습하기 위한 **Turborepo 모노레포**입니다. **pnpm**을 패키지 매니저로 사용하며, 공유 패키지를 포함한 두 개의 Next.js 애플리케이션으로 구성되어 있습니다.

### 워크스페이스 구조

- **앱:**
  - `apps/web` - 포트 3000에서 실행되는 Next.js 앱
  - `apps/docs` - 포트 3001에서 실행되는 Next.js 앱

- **공유 패키지:**
  - `@repo/ui` - 두 앱이 공유하는 React 컴포넌트 라이브러리
  - `@repo/eslint-config` - ESLint 설정
  - `@repo/typescript-config` - TypeScript 설정

## Turborepo 태스크 파이프라인 이해하기

### 태스크 의존성 (`turbo.json`)

Turborepo는 태스크 파이프라인 시스템을 사용합니다:
- `"dependsOn": ["^build"]`는 "의존하는 모든 워크스페이스의 build 태스크를 먼저 실행"을 의미
- `^` 접두사는 의존성 워크스페이스의 태스크가 현재 워크스페이스보다 먼저 실행됨을 나타냄

**빌드 파이프라인:**
```
@repo/ui:build → apps/web:build
                → apps/docs:build
```

`pnpm build` 실행 시 Turborepo는:
1. `@repo/ui`를 먼저 빌드 (의존성)
2. 그 다음 `web`과 `docs`를 병렬로 빌드

**린트/타입 체크 파이프라인:**
- `lint`와 `check-types`에도 동일한 패턴 적용
- 공유 설정이 앱별 체크보다 먼저 검증됨

**개발 모드:**
- `"cache": false` - 개발 서버 출력은 절대 캐싱되지 않음
- `"persistent": true` - 개발 서버를 계속 실행 상태로 유지

### 캐싱 전략

- **빌드 출력물:** `.next/**` (cache 제외)
- **입력:** 모든 기본 파일 + `.env*` 파일
- 환경 변수 파일 변경 시 재빌드 트리거

## 필수 명령어

### 개발
```bash
# 모든 앱을 개발 모드로 실행
pnpm dev

# 특정 앱만 실행 (Turbo 필터 사용)
pnpm dev --filter=web
pnpm dev --filter=docs
```

### 빌드
```bash
# 모든 앱과 패키지 빌드
pnpm build

# 특정 앱만 빌드
pnpm build --filter=web
```

### 코드 품질
```bash
# 모든 패키지 린트
pnpm lint

# 모든 패키지 타입 체크
pnpm check-types

# 코드 포맷팅
pnpm format
```

### UI 패키지 개발
```bash
# @repo/ui에 새로운 React 컴포넌트 생성
cd packages/ui
pnpm generate:component
```

## Turborepo 핵심 개념

### 워크스페이스 프로토콜
- 의존성은 `workspace:*`를 사용하여 로컬 패키지 참조
- 예시: apps/web/package.json의 `"@repo/ui": "workspace:*"`
- pnpm이 설치 시 이를 로컬 패키지로 해석

### 태스크 실행 순서
1. **위상 정렬 (Topological sorting)** - `dependsOn` 관계를 존중
2. **병렬 실행 (Parallel execution)** - 독립적인 태스크는 동시 실행
3. **증분 빌드 (Incremental builds)** - 변경된 패키지만 재빌드

### 필터 패턴
```bash
# 단일 패키지
--filter=web

# 여러 패키지
--filter=web --filter=docs

# 모든 앱
--filter='./apps/*'

# 패키지와 그 의존성
--filter=web...
```

## 기술 스택

- **Node:** >=18 필수
- **패키지 매니저:** pnpm 9.0.0
- **프레임워크:** Next.js 15.5+ with Turbopack
- **TypeScript:** 5.9.2
- **React:** 19.1.0
- **린팅:** ESLint 9.34+
- **포맷팅:** Prettier 3.6+

## 개발 워크플로우

1. **의존성 설치:** `pnpm install` (pnpm이 자동으로 수행)
2. **개발 서버 시작:** `pnpm dev` (web은 :3000, docs는 :3001)
3. **변경 사항 반영:** Turborepo가 감시하고 영향받는 패키지를 재빌드
4. **품질 체크:** `pnpm lint && pnpm check-types`
5. **프로덕션 빌드:** `pnpm build`

## 중요 사항

- 린트와 타입 체크 명령어는 `--max-warnings 0` 사용 (경고 제로 허용)
- 개발 서버는 더 빠른 개발 빌드를 위해 Turbopack 사용
- 모든 패키지는 TypeScript 전용 (100% 타입 커버리지)
- UI 패키지는 `./*` 패턴 매칭을 통해 컴포넌트 내보내기
