import { Module } from '@nestjs/common';
import { MongooseModule, ModelDefinition } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DbMigrationService } from './db-migration.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        // SSL/TLS 관련 옵션 추가
        ssl: true,
        tlsInsecure: false,
        retryWrites: true,
        w: 'majority',
        // 연결 타임아웃 및 재시도 설정
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        // 버퍼링 관련 설정
        bufferCommands: false,
        bufferMaxEntries: 0,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DbMigrationService],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
