import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/decorators';

import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  profilePictureUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() avatar: unknown,
    @GetCurrentUserId() userId: string,
  ): Promise<string> {
    return this.userService.profilePictureUpload(file, userId);
  }

  @Get('/upload/:userName')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('userName') userName: string): Promise<UserEntity> {
    return this.userService.getUserByName(userName);
  }

  @Get('likedArticles')
  @HttpCode(HttpStatus.OK)
  getLikedArticlesIds(
    @GetCurrentUserId() userId: string,
  ): Promise<string[]> {
    return this.userService.getLikedArticlesIds(userId);
  }
}
