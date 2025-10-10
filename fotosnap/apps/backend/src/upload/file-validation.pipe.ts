import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 1024 * 1024 * 5; // 5MB

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds the maximum size of ${this.maxSize / 1024 / 1024} MB`,
      );
    }

    return value;
  }
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `File type is not allowed. Allowed types are ${this.allowedTypes.join(', ')}`,
      );
    }

    return value;
  }
}
