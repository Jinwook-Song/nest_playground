# Authentication Overview

## 시스템 구조

이 NestJS 애플리케이션은 다중 인증 전략을 구현하여 유연하고 안전한 사용자 인증을 제공합니다.

### 지원하는 인증 방식

1. **로컬 인증 (Local Authentication)**
   - 이메일과 비밀번호를 이용한 전통적인 인증
   - bcrypt를 사용한 비밀번호 해시화
   - 엔드포인트: `POST /auth/login`

2. **Google OAuth 2.0**
   - Google 계정을 통한 소셜 로그인
   - 사용자 자동 생성 기능
   - 엔드포인트: `GET /auth/google`, `GET /auth/google/callback`

3. **JWT 기반 인증**
   - Access Token과 Refresh Token 이중 토큰 시스템
   - HTTP-only 쿠키를 통한 안전한 토큰 전송
   - 토큰 자동 갱신 기능

## 핵심 컴포넌트

### AuthModule
- 모든 인증 관련 구성 요소를 중앙에서 관리
- Passport 전략들과 JWT 모듈을 통합
- 의존성 주입을 통한 모듈 간 통신

### AuthService
- 토큰 생성 및 검증 로직
- 사용자 인증 처리
- 쿠키 기반 세션 관리

### AuthController
- REST API 엔드포인트 제공
- 각 인증 방식에 대한 라우트 정의
- Guard를 통한 보안 검증

## 보안 특징

- **비밀번호 암호화**: bcrypt 해시 (salt rounds: 10)
- **토큰 보안**: Refresh token 데이터베이스 해시 저장
- **XSS 방어**: HTTP-only 쿠키 사용
- **CSRF 방어**: SameSite 쿠키 정책
- **토큰 만료**: 액세스/리프레시 토큰 자동 만료