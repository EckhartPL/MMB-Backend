import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerOptions.config';
import { UploadResponse } from 'types';

import { UploadService } from './upload.service';

import { GetCurrentUserId } from '../../decorators';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ): Promise<UploadResponse> {
    return this.uploadService.uploadProfilePicture(file, userId);
  }
}
