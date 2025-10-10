import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtension = file.originalname.split('.')[1];
  const randomName = uuidv4();
  callback(null, `${name}-${Date.now()}-${randomName}.${fileExtension}`);
};

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed'),
      false,
    );
  }
  callback(null, true);
};

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
};
