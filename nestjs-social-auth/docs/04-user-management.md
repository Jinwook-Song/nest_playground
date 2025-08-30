# User Management

## User Schema 구조

### MongoDB User Document
```typescript
@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;
}
```

### 스키마 특징
- **_id**: MongoDB ObjectId (자동 생성)
- **email**: 유니크 제약 조건, 사용자 식별자
- **password**: bcrypt 해시, OAuth 사용자는 빈 문자열
- **refreshToken**: 해시된 리프레시 토큰 (선택적)

## UsersService 주요 메서드

### 1. create() - 사용자 생성
```typescript
async create(user: CreateUserRequest) {
  return await new this.userModel({
    ...user,
    password: await hash(user.password, 10),
  }).save();
}
```
- 비밀번호 자동 해시 (bcrypt, salt rounds: 10)
- CreateUserRequest DTO 검증 통과 후 생성

### 2. getUser() - 단일 사용자 조회
```typescript
async getUser(query: FilterQuery<User>) {
  const user = await this.userModel.findOne(query);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user.toObject();
}
```
- MongoDB FilterQuery 지원
- 사용자 미존재 시 NotFoundException
- toObject()로 Mongoose 래퍼 제거

### 3. getUsers() - 전체 사용자 조회
```typescript
async getUsers() {
  const users = await this.userModel.find();
  return users.map((user) => user.toObject());
}
```
- 모든 사용자 반환
- 배치 toObject() 처리

### 4. updateUser() - 사용자 업데이트
```typescript
async updateUser(query: FilterQuery<User>, update: UpdateQuery<User>) {
  return this.userModel.findOneAndUpdate(query, update);
}
```
- 리프레시 토큰 업데이트에 주로 사용
- MongoDB UpdateQuery 지원

### 5. getOrCreateUser() - OAuth 전용 메서드
```typescript
async getOrCreateUser(data: CreateUserRequest) {
  const user = await this.userModel.findOne({ email: data.email });
  if (user) {
    return user;
  }
  return await this.create(data);
}
```
- Google OAuth에서 사용
- 기존 사용자 반환 또는 새 사용자 생성

## DTO (Data Transfer Object)

### CreateUserRequest
```typescript
export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### 검증 규칙
- **email**: 유효한 이메일 형식
- **password**: 최소 6자 이상 문자열

## 사용자 인증 플로우

### 1. 로컬 회원가입
```bash
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### 2. 로컬 로그인
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### 3. Google OAuth
```bash
# 1단계: Google 인증 페이지로 리다이렉트
GET /auth/google

# 2단계: Google 콜백 처리 (자동)
GET /auth/google/callback?code=...
```

## 보안 고려사항

### 1. 비밀번호 관리
- bcrypt 해시 (salt rounds: 10)
- 원본 비밀번호 저장 금지
- OAuth 사용자는 빈 비밀번호

### 2. 이메일 유니크 제약
- 중복 가입 방지
- OAuth와 로컬 계정 통합 가능

### 3. 리프레시 토큰 관리
- 데이터베이스에 해시 저장
- 로그아웃 시 제거
- 토큰 순환 (rotation) 구현

## 확장 가능한 구조

### 추가 가능한 필드
```typescript
@Schema()
export class User {
  // 기존 필드들...

  @Prop()
  name?: string;

  @Prop()
  profilePicture?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
}
```

### 역할 기반 접근 제어 (RBAC)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.role === 'admin';
  }
}
```

## 데이터베이스 인덱스 권장사항

```javascript
// MongoDB 인덱스 생성
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "refreshToken": 1 })
db.users.createIndex({ "createdAt": 1 })
```