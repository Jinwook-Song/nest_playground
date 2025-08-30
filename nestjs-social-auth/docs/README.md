# NestJS Social Authentication Documentation

## 📖 문서 구조

이 문서들은 NestJS 소셜 인증 시스템을 학습하고 이해하기 위한 가이드입니다.

### 📚 문서 목록

1. **[인증 개요](./01-authentication-overview.md)**
   - 전체 인증 시스템 구조
   - 지원하는 인증 방식
   - 핵심 컴포넌트 소개
   - 보안 특징

2. **[인증 전략](./02-authentication-strategies.md)**
   - Local Strategy (이메일/비밀번호)
   - JWT Strategy (액세스 토큰)
   - JWT Refresh Strategy (리프레시 토큰)
   - Google OAuth Strategy
   - Guards 사용법

3. **[JWT 토큰 관리](./03-jwt-token-management.md)**
   - 이중 토큰 시스템 (Access + Refresh)
   - 토큰 생성 및 검증 로직
   - 토큰 갱신 프로세스
   - 보안 고려사항
   - 클라이언트 연동 방법

4. **[사용자 관리](./04-user-management.md)**
   - User Schema 구조
   - UsersService 메서드들
   - DTO 및 검증 규칙
   - 사용자 인증 플로우
   - 데이터베이스 최적화

5. **[API 엔드포인트](./05-api-endpoints.md)**
   - 인증 관련 API
   - 사용자 관리 API
   - HTTP 상태 코드
   - 에러 처리
   - 테스팅 예시

6. **[테스팅 가이드](./06-testing-guide.md)**
   - 단위 테스트 작성법
   - E2E 테스트 구현
   - 테스트 데이터베이스 설정
   - 목킹 전략
   - 커버리지 관리

7. **[배포 및 설정](./07-deployment-configuration.md)**
   - 환경 변수 설정
   - Docker 배포
   - 클라우드 배포 (AWS, Heroku)
   - 보안 설정
   - 모니터링 및 성능 최적화

## 🚀 빠른 시작

### 1. 프로젝트 설정
```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
```

### 2. 데이터베이스 시작 (Docker)
```bash
pnpm run docker:up
```

### 3. 애플리케이션 실행
```bash
# 개발 모드
pnpm run start:dev
```

### 4. 테스트 실행
```bash
# 단위 테스트
pnpm run test

# E2E 테스트
pnpm run test:e2e
```

## 🔑 핵심 학습 포인트

### NestJS 개념
- **모듈 시스템**: AuthModule, UsersModule의 구조
- **의존성 주입**: Service와 Controller 간 연결
- **가드(Guards)**: 라우트 보호 메커니즘
- **데코레이터**: @CurrentUser, @UseGuards 활용
- **파이프(Pipes)**: 데이터 검증 및 변환

### 인증 관련 패턴
- **Passport.js 통합**: 다중 인증 전략 구현
- **JWT 이중 토큰**: 보안과 사용성의 균형
- **쿠키 기반 세션**: XSS 방어를 위한 HTTP-only 쿠키
- **OAuth 2.0**: Google 소셜 로그인 구현
- **비밀번호 해싱**: bcrypt를 이용한 안전한 저장

### 데이터베이스 연동
- **Mongoose ODM**: MongoDB와의 연동
- **스키마 설계**: User 모델 구조
- **데이터 검증**: class-validator 활용
- **인덱스 최적화**: 성능 향상 기법

### 테스팅 전략
- **단위 테스트**: 비즈니스 로직 검증
- **통합 테스트**: 모듈 간 상호작용 확인
- **E2E 테스트**: 전체 워크플로우 검증
- **목킹**: 외부 의존성 격리

## 🛠️ 확장 아이디어

### 기능 확장
- [ ] 역할 기반 접근 제어 (RBAC)
- [ ] 이메일 인증 시스템
- [ ] 비밀번호 재설정 기능
- [ ] 계정 잠금 정책
- [ ] 소셜 로그인 추가 (Facebook, GitHub)

### 보안 강화
- [ ] Rate Limiting
- [ ] CSRF 토큰
- [ ] IP 화이트리스트
- [ ] 로그인 기록 및 알림
- [ ] 2단계 인증 (2FA)

### 성능 최적화
- [ ] Redis 캐싱
- [ ] 데이터베이스 연결 풀링
- [ ] 응답 압축
- [ ] CDN 연동
- [ ] 로드 밸런싱

## 📞 도움말

### 문제 해결
1. **MongoDB 연결 오류**: docker-compose 상태 확인
2. **JWT 토큰 오류**: 환경 변수 설정 확인
3. **Google OAuth 오류**: 클라이언트 ID/Secret 확인
4. **테스트 실패**: 데이터베이스 상태 초기화

### 추가 학습 자료
- [NestJS 공식 문서](https://docs.nestjs.com)
- [Passport.js 가이드](http://www.passportjs.org/docs/)
- [JWT 명세서](https://jwt.io/)
- [MongoDB 튜토리얼](https://docs.mongodb.com/)

---

**🎯 학습 목표**: 이 문서들을 통해 NestJS의 인증 시스템을 완전히 이해하고, 실제 프로덕션 환경에서 사용할 수 있는 수준의 지식을 습득하세요!