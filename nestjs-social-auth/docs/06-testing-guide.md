# Testing Guide

## 테스트 구조 개요

이 프로젝트는 Jest 테스트 프레임워크를 사용하여 단위 테스트와 통합 테스트를 구현합니다.

### 테스트 파일 구조
```
src/
├── auth/
│   ├── auth.controller.spec.ts    # 인증 컨트롤러 테스트
│   ├── auth.service.spec.ts       # 인증 서비스 테스트
├── users/
│   ├── users.controller.spec.ts   # 사용자 컨트롤러 테스트
│   ├── users.service.spec.ts      # 사용자 서비스 테스트
test/
├── app.e2e-spec.ts               # E2E 테스트
├── jest-e2e.json                 # E2E 테스트 설정
```

## 테스트 실행 명령어

### 단위 테스트
```bash
# 모든 단위 테스트 실행
pnpm run test

# 파일 변경 감지 모드
pnpm run test:watch

# 커버리지 리포트 생성
pnpm run test:cov

# 디버그 모드
pnpm run test:debug
```

### E2E 테스트
```bash
# E2E 테스트 실행
pnpm run test:e2e
```

### 특정 테스트 파일 실행
```bash
# 특정 파일만 테스트
pnpm run test auth.service.spec.ts

# 특정 테스트 케이스만 실행
pnpm run test -- --testNamePattern="should login user"
```

## 단위 테스트 예시

### AuthService 테스트
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockUsersService = {
      getUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn(),
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  describe('verifyUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      usersService.getUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.verifyUser('test@example.com', 'password');

      expect(result).toBe(mockUser);
      expect(usersService.getUser).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password',
      };

      usersService.getUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.verifyUser('test@example.com', 'wrong_password'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should set cookies and update refresh token', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashed_password',
      };

      const mockResponse = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as any;

      configService.getOrThrow.mockImplementation((key: string) => {
        const config = {
          'JWT_ACCESS_TOKEN_EXPIRATION_MS': '900000',
          'JWT_REFRESH_TOKEN_EXPIRATION_MS': '86400000',
          'JWT_ACCESS_TOKEN_SECRET': 'access_secret',
          'JWT_REFRESH_TOKEN_SECRET': 'refresh_secret',
        };
        return config[key];
      });

      configService.get.mockReturnValue('development');
      jwtService.sign.mockReturnValue('mock_token');
      usersService.updateUser.mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_refresh_token');

      await service.login(mockUser, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(usersService.updateUser).toHaveBeenCalled();
    });
  });
});
```

## E2E 테스트 예시

### 인증 플로우 E2E 테스트
```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain('Authentication=');
          expect(res.headers['set-cookie'][1]).toContain('Refresh=');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password'
        })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh tokens with valid refresh token', async () => {
      // 먼저 로그인하여 토큰 획득
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const cookies = loginResponse.headers['set-cookie'];

      // 리프레시 토큰으로 새 토큰 요청
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain('Authentication=');
        });
    });
  });
});
```

## 테스트 데이터베이스 설정

### 인메모리 MongoDB 사용
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

describe('Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let app: INestApplication;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        // 다른 모듈들...
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
});
```

## 목킹 전략

### 서비스 목킹
```typescript
const mockUsersService = {
  create: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  getOrCreateUser: jest.fn(),
};

// 테스트에서 사용
mockUsersService.getUser.mockResolvedValue(mockUser);
mockUsersService.create.mockRejectedValue(new Error('Database error'));
```

### HTTP 요청 목킹
```typescript
import * as nock from 'nock';

// Google OAuth API 목킹
nock('https://oauth2.googleapis.com')
  .post('/token')
  .reply(200, {
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
  });
```

## 커버리지 목표

### 최소 커버리지 기준
- **전체**: 80% 이상
- **Functions**: 85% 이상
- **Lines**: 80% 이상
- **Branches**: 75% 이상

### Jest 설정 (package.json)
```json
{
  "jest": {
    "collectCoverageFrom": [
      "**/*.(t|j)s",
      "!**/*.spec.ts",
      "!**/*.e2e-spec.ts",
      "!**/node_modules/**",
      "!**/dist/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 85,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 테스트 모범 사례

### 1. AAA 패턴 (Arrange-Act-Assert)
```typescript
it('should create user successfully', async () => {
  // Arrange
  const userData = { email: 'test@example.com', password: 'password123' };
  mockUsersService.create.mockResolvedValue(mockUser);

  // Act
  const result = await service.createUser(userData);

  // Assert
  expect(result).toEqual(mockUser);
  expect(mockUsersService.create).toHaveBeenCalledWith(userData);
});
```

### 2. 테스트 격리
```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### 3. 의미있는 테스트 이름
```typescript
describe('AuthService', () => {
  describe('when verifying user credentials', () => {
    it('should return user object for valid email and password', () => {
      // 테스트 구현
    });

    it('should throw UnauthorizedException for invalid password', () => {
      // 테스트 구현
    });

    it('should throw UnauthorizedException for non-existent user', () => {
      // 테스트 구현
    });
  });
});
```

## 디버깅 팁

### VS Code 디버거 설정
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 테스트 로그 확인
```typescript
// 테스트 중 콘솔 출력
console.log('Debug info:', result);

// Jest에서 로그 보기
pnpm run test -- --verbose
```