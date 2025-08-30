# Authentication Strategies

## 1. Local Strategy (로컬 인증 전략)

### 구현 위치
- `src/auth/strategies/local.strategy.ts`
- `src/auth/guards/local-auth.guard.ts`

### 동작 원리
```typescript
// LocalStrategy 핵심 로직
async validate(email: string, password: string) {
  return this.authService.verifyUser(email, password);
}
```

### 사용법
```typescript
@Post('login')
@UseGuards(LocalAuthGuard)
async login(
  @CurrentUser() user: User,
  @Res({ passthrough: true }) response: Response,
) {
  await this.authService.login(user, response);
}
```

### 특징
- 이메일을 사용자명으로 사용 (`usernameField: 'email'`)
- bcrypt로 비밀번호 검증
- 실패 시 `UnauthorizedException` 발생

## 2. JWT Strategy (JWT 인증 전략)

### 구현 위치
- `src/auth/strategies/jwt.strategy.ts`
- `src/auth/guards/jwt-auth.guard.ts`

### 토큰 추출 방식
```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (req: Request) =>
    req?.cookies?.Authentication || req?.headers?.authentication,
]),
```

### 검증 로직
```typescript
async validate(payload: TokenPayload) {
  return this.usersService.getUser({ _id: payload.userId });
}
```

### 특징
- 쿠키 우선, 헤더 대체 가능
- 토큰 만료 자동 검증
- 사용자 존재 여부 확인

## 3. JWT Refresh Strategy (리프레시 토큰 전략)

### 구현 위치
- `src/auth/strategies/jwt-refresh.strategy.ts`
- `src/auth/guards/jwt-refresh-auth.guard.ts`

### 검증 과정
1. 리프레시 토큰 추출 (`Refresh` 쿠키)
2. 토큰 유효성 검증
3. 데이터베이스의 해시된 토큰과 비교
4. 사용자 반환

### 보안 특징
- 리프레시 토큰은 데이터베이스에 해시 저장
- 사용 시마다 새로운 토큰으로 갱신
- 토큰 탈취 시 피해 최소화

## 4. Google Strategy (Google OAuth 전략)

### 구현 위치
- `src/auth/strategies/google.strategy.ts`
- `src/auth/guards/google-auth.guard.ts`

### OAuth 설정
```typescript
super({
  clientID: configService.getOrThrow('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: configService.getOrThrow('GOOGLE_AUTH_CLIENT_SECRET'),
  callbackURL: configService.getOrThrow('GOOGLE_AUTH_REDIRECT_URL'),
  scope: ['email', 'profile'],
});
```

### 사용자 처리
```typescript
async validate(_accessToken: string, _refreshToken: string, profile: any) {
  return this.usersService.getOrCreateUser({
    email: profile.emails?.[0]?.value ?? '',
    password: '', // OAuth 사용자는 빈 비밀번호
  });
}
```

### 특징
- 사용자 자동 생성 (`getOrCreateUser`)
- 이메일만 필수, 비밀번호 불필요
- Google 프로필 정보 활용

## Guards 사용법

### JwtAuthGuard (보호된 라우트)
```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
async getProtected(@CurrentUser() user: User) {
  return { user: user.email };
}
```

### 여러 Guard 조합
```typescript
@Post('admin-action')
@UseGuards(JwtAuthGuard, AdminGuard)
async adminAction(@CurrentUser() user: User) {
  // 관리자 전용 기능
}
```