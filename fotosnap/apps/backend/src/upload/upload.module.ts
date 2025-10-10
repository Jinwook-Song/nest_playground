import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './upload.config';

@Module({
  imports: [MulterModule.register(multerConfig)],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
