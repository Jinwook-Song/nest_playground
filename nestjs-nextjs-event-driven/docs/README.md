# NestJS-NextJS 이벤트 기반 통신 시스템 문서

이 폴더는 프로젝트의 아키텍처와 이벤트 기반 통신 시스템에 대한 문서들을 포함합니다.

## 📚 문서 목록

- [아키텍처 개요](./architecture.md) - 전체 시스템 구조와 설계 패턴
- [API 문서](./api.md) - REST API 엔드포인트 및 SSE 스트림 문서
- [이벤트 플로우](./event-flow.md) - 이벤트 기반 통신 흐름 상세 설명

## 🚀 빠른 시작

1. 프로젝트 루트에서 의존성 설치:

   ```bash
   npm install
   ```

2. 개발 서버 시작:

   ```bash
   npm run dev
   ```

3. 백엔드: http://localhost:3000
4. 프론트엔드: http://localhost:3001

## 🛠️ 기술 스택

- **백엔드**: NestJS, RxJS, EventEmitter
- **프론트엔드**: Next.js, EventSource API
- **빌드 도구**: Turborepo
- **통신**: Server-Sent Events (SSE)
