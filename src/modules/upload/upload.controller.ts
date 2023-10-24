import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadEntity } from './entities';
import { UploadService } from './upload.service';

import { multerOptions } from '../../config/multerOptions.config';
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
  ): Promise<UploadEntity> {
    return this.uploadService.uploadProfilePicture(file, userId);
  }
}
