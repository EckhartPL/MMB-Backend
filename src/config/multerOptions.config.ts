import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { extname } from 'path';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024 * 10, // 10MB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      done(null, true);
    } else {
      done(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};

export const generateFileName = (originalname: string): string => {
  const fileExtension = extname(originalname);
  return `${originalname
    .replace(fileExtension, '')
    .toLowerCase()
    .replace(/ /g, '-')}-${uuid().slice(0, 10)}${fileExtension}`;
};
