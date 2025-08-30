# Deployment & Configuration

## 환경 설정

### 필수 환경 변수
```bash
# 데이터베이스
MONGODB_URI=mongodb://localhost:27017/nestjs-social-auth

# JWT 토큰 설정
JWT_ACCESS_TOKEN_SECRET=your_very_secure_access_token_secret
JWT_ACCESS_TOKEN_EXPIRATION_MS=900000      # 15분 (밀리초)
JWT_REFRESH_TOKEN_SECRET=your_very_secure_refresh_token_secret  
JWT_REFRESH_TOKEN_EXPIRATION_MS=86400000   # 24시간 (밀리초)

# Google OAuth 설정
GOOGLE_AUTH_CLIENT_ID=your_google_client_id
GOOGLE_AUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_AUTH_REDIRECT_URL=http://localhost:3000/auth/google/callback

# 애플리케이션 설정
NODE_ENV=production
PORT=3000
AUTH_UI_REDIRECT=http://localhost:3000/dashboard
```

### 환경별 설정 파일

#### .env.development
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nestjs-social-auth-dev
JWT_ACCESS_TOKEN_EXPIRATION_MS=900000
JWT_REFRESH_TOKEN_EXPIRATION_MS=86400000
AUTH_UI_REDIRECT=http://localhost:3000/dashboard
```

#### .env.production
```bash
NODE_ENV=production
MONGODB_URI=mongodb://production-server:27017/nestjs-social-auth
JWT_ACCESS_TOKEN_EXPIRATION_MS=600000      # 10분 (더 짧게)
JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000  # 7일
AUTH_UI_REDIRECT=https://yourdomain.com/dashboard
```

#### .env.test
```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/nestjs-social-auth-test
JWT_ACCESS_TOKEN_SECRET=test_access_secret
JWT_REFRESH_TOKEN_SECRET=test_refresh_secret
```

## Docker 배포

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

# pnpm 설치
RUN npm install -g pnpm

WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY . .
RUN pnpm run build

# 프로덕션 단계
FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# 빌드 결과 복사
COPY --from=builder /app/dist ./dist

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/nestjs-social-auth
    depends_on:
      - mongo
    networks:
      - app-network

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
```

### 개발용 docker-compose.dev.yml
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - ./data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=nestjs-social-auth-dev
```

## 클라우드 배포

### AWS ECS 배포

#### task-definition.json
```json
{
  "family": "nestjs-social-auth",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "nestjs-app",
      "image": "your-registry/nestjs-social-auth:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:ssm:region:account:parameter/nestjs/mongodb-uri"
        },
        {
          "name": "JWT_ACCESS_TOKEN_SECRET",
          "valueFrom": "arn:aws:ssm:region:account:parameter/nestjs/jwt-access-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nestjs-social-auth",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Heroku 배포

#### Procfile
```
web: node dist/main.js
```

#### heroku.yml (컨테이너 배포 시)
```yaml
build:
  docker:
    web: Dockerfile
run:
  web: node dist/main.js
```

## 보안 설정

### 프로덕션 보안 체크리스트

#### 1. 환경 변수 보안
- [ ] 모든 시크릿 키는 환경 변수로 관리
- [ ] .env 파일은 .gitignore에 추가
- [ ] 프로덕션에서는 AWS Secrets Manager 등 사용

#### 2. HTTPS 설정
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 보안 헤더 설정
  app.use(helmet());
  
  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  // 쿠키 파서
  app.use(cookieParser());
  
  // 글로벌 프리픽스
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
```

#### 3. 데이터베이스 보안
```typescript
// app.module.ts
MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.getOrThrow('MONGODB_URI'),
    // 연결 보안 설정
    authSource: 'admin',
    ssl: configService.get('NODE_ENV') === 'production',
    retryWrites: true,
    w: 'majority',
  }),
  inject: [ConfigService],
}),
```

## 모니터링 및 로깅

### 로깅 설정
```typescript
// logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

### 헬스 체크
```typescript
// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongoose'),
    ]);
  }
}
```

## 성능 최적화

### 캐싱 설정
```typescript
// cache.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: 300, // 5분
  }),
}),
```

### 압축 설정
```typescript
// main.ts
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 응답 압축
  app.use(compression());
  
  await app.listen(3000);
}
```

## CI/CD 파이프라인

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: latest
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Run tests
      run: pnpm run test
      
    - name: Run e2e tests
      run: pnpm run test:e2e
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to AWS ECS
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: task-definition.json
        service: nestjs-social-auth-service
        cluster: production-cluster
```

## 백업 전략

### MongoDB 백업 스크립트
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="nestjs-social-auth"

# 백업 생성
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

# S3에 업로드 (선택적)
# aws s3 sync $BACKUP_DIR/$DATE s3://your-backup-bucket/$DATE
```

### 자동 백업 크론잡
```bash
# crontab -e
0 2 * * * /path/to/backup.sh
```