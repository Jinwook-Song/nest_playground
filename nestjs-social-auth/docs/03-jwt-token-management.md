# JWT Token Management

## 토큰 시스템 구조

### Dual Token System (이중 토큰 시스템)

1. **Access Token**
   - 짧은 수명 (기본: 15분)
   - API 요청 인증에 사용
   - 쿠키명: `Authentication`

2. **Refresh Token**
   - 긴 수명 (기본: 24시간)
   - Access Token 갱신에 사용
   - 쿠키명: `Refresh`

## 토큰 생성 로직

### AuthService.login() 메서드
```typescript
async login(user: User, response: Response, redirect = false) {
  // 1. 만료 시간 설정
  const expiresAccessToken = new Date();
  expiresAccessToken.setMilliseconds(
    expiresAccessToken.getTime() +
    parseInt(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'))
  );

  const expiresRefreshToken = new Date();
  expiresRefreshToken.setMilliseconds(
    expiresRefreshToken.getTime() +
    parseInt(this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'))
  );

  // 2. 토큰 페이로드 구성
  const tokenPayload: TokenPayload = {
    userId: user._id.toHexString(),
  };

  // 3. 토큰 생성
  const accessToken = this.jwtService.sign(tokenPayload, {
    secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
  });

  const refreshToken = this.jwtService.sign(tokenPayload, {
    secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
    expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`,
  });

  // 4. 리프레시 토큰 데이터베이스 저장 (해시)
  await this.usersService.updateUser(
    { _id: user._id },
    { $set: { refreshToken: await hash(refreshToken, 10) } }
  );

  // 5. 쿠키 설정
  response.cookie('Authentication', accessToken, {
    httpOnly: true,
    secure: this.configService.get('NODE_ENV') === 'production',
    expires: expiresAccessToken,
  });
  
  response.cookie('Refresh', refreshToken, {
    httpOnly: true,
    secure: this.configService.get('NODE_ENV') === 'production',
    expires: expiresRefreshToken,
  });
}
```

## 토큰 검증

### Access Token 검증 (JwtStrategy)
```typescript
async validate(payload: TokenPayload) {
  return this.usersService.getUser({ _id: payload.userId });
}
```

### Refresh Token 검증 (JwtRefreshStrategy)
```typescript
async validate(req: Request, payload: TokenPayload) {
  const refreshToken = req.cookies?.Refresh;
  return this.authService.verifyUserRefreshToken(refreshToken, payload.userId);
}
```

## 토큰 갱신 프로세스

### 1. 클라이언트 요청
```bash
POST /auth/refresh
Cookie: Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 서버 검증 및 갱신
```typescript
@Post('refresh')
@UseGuards(JwtRefreshAuthGuard)
async refresh(
  @CurrentUser() user: User,
  @Res({ passthrough: true }) response: Response,
) {
  await this.authService.login(user, response); // 새 토큰 발급
}
```

### 3. 보안 검증 로직
```typescript
async verifyUserRefreshToken(refreshToken: string, userId: string) {
  try {
    const user = await this.usersService.getUser({ _id: userId });
    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    
    // 데이터베이스의 해시와 비교
    const authenticated = await compare(refreshToken, user.refreshToken);
    if (!authenticated) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    
    return user;
  } catch (error) {
    throw new UnauthorizedException('Refresh token is invalid');
  }
}
```

## 보안 고려사항

### 1. 토큰 저장 방식
- **Access Token**: HTTP-only 쿠키로 XSS 방어
- **Refresh Token**: 데이터베이스에 해시 저장
- **Secure Flag**: 프로덕션에서 HTTPS 전용

### 2. 토큰 만료 관리
- **짧은 Access Token**: 토큰 탈취 피해 최소화
- **긴 Refresh Token**: 사용자 편의성 제공
- **자동 갱신**: 만료 전 무감각 토큰 갱신

### 3. 토큰 무효화
- 로그아웃 시 데이터베이스에서 Refresh Token 제거
- 비밀번호 변경 시 모든 토큰 무효화
- 의심스러운 활동 감지 시 강제 로그아웃

## 환경 변수 설정

```bash
# JWT 시크릿 키 (각각 다른 값 사용 필수)
JWT_ACCESS_TOKEN_SECRET=your_very_secure_access_secret
JWT_REFRESH_TOKEN_SECRET=your_very_secure_refresh_secret

# 토큰 만료 시간 (밀리초)
JWT_ACCESS_TOKEN_EXPIRATION_MS=900000      # 15분
JWT_REFRESH_TOKEN_EXPIRATION_MS=86400000   # 24시간
```

## 클라이언트 연동 예시

### Axios 인터셉터 설정
```javascript
// 자동 토큰 갱신 인터셉터
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await axios.post('/auth/refresh');
        return axios.request(error.config); // 원래 요청 재시도
      } catch (refreshError) {
        // 리프레시 실패 시 로그인 페이지로 이동
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```