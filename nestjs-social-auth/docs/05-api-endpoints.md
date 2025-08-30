# API Endpoints

## 인증 관련 API

### 1. 로컬 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (성공):**
```http
HTTP/1.1 200 OK
Set-Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
Set-Cookie: Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
```

**Response (실패):**
```http
HTTP/1.1 401 Unauthorized
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 2. 토큰 갱신
```http
POST /auth/refresh
Cookie: Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (성공):**
```http
HTTP/1.1 200 OK
Set-Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
Set-Cookie: Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
```

### 3. Google OAuth 로그인
```http
GET /auth/google
```

**Response:**
```http
HTTP/1.1 302 Found
Location: https://accounts.google.com/oauth/authorize?client_id=...
```

### 4. Google OAuth 콜백
```http
GET /auth/google/callback?code=AUTHORIZATION_CODE&state=STATE
```

**Response (성공):**
```http
HTTP/1.1 302 Found
Location: http://localhost:3000/dashboard
Set-Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
Set-Cookie: Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure
```

## 사용자 관리 API

### 1. 사용자 생성 (회원가입)
```http
POST /users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword123"
}
```

**Response (성공):**
```http
HTTP/1.1 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "newuser@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Response (중복 이메일):**
```http
HTTP/1.1 400 Bad Request
{
  "statusCode": 400,
  "message": "E11000 duplicate key error collection",
  "error": "Bad Request"
}
```

### 2. 전체 사용자 조회 (관리자 전용)
```http
GET /users
Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user1@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user2@example.com",
    "createdAt": "2024-01-15T11:30:00.000Z"
  }
]
```

## 보호된 라우트 예시

### 현재 사용자 정보 조회
```http
GET /me
Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Controller 구현:**
```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
async getCurrentUser(@CurrentUser() user: User) {
  return {
    id: user._id,
    email: user.email
  };
}
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

## HTTP 상태 코드

### 성공 응답
- **200 OK**: 요청 성공
- **201 Created**: 리소스 생성 성공
- **302 Found**: 리다이렉트 (OAuth)

### 클라이언트 오류
- **400 Bad Request**: 잘못된 요청 데이터
- **401 Unauthorized**: 인증 실패
- **403 Forbidden**: 권한 부족
- **404 Not Found**: 리소스 없음
- **409 Conflict**: 중복 리소스

### 서버 오류
- **500 Internal Server Error**: 서버 내부 오류

## 인증 헤더 사용법

### Cookie 방식 (권장)
```http
Cookie: Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authorization 헤더 (대안)
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## CORS 설정 고려사항

### 프론트엔드와 연동 시
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true, // 쿠키 전송 허용
});
```

## API 테스팅 예시

### Postman/Insomnia 설정
1. **로그인 요청 후 쿠키 자동 저장**
2. **후속 요청에 쿠키 자동 포함**
3. **리프레시 토큰 갱신 테스트**

### cURL 명령어
```bash
# 로그인
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# 보호된 라우트 접근
curl -X GET http://localhost:3000/me \
  -b cookies.txt

# 토큰 갱신
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

## 에러 처리

### 글로벌 예외 필터
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : 500;
    
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: exception.message || 'Internal server error'
    });
  }
}
```