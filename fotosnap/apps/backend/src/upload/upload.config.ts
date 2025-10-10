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

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: editFileName,
  }),
};
