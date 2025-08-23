import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 정의된 필드만 허용
      forbidNonWhitelisted: true, // 정의되지 않은 필드 시 에러
      transform: true, // 타입 자동 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
