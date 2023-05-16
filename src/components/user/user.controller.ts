import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/decorators';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  async profilePictureUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() avatar: any,
    @GetCurrentUserId() userId: string,
  ) {
    await this.userService.profilePictureUpload(file, userId);
  }

  @Get('/upload/:userName')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('userName') userName: string, @Res() res: Response) {
    await this.userService.getUser(userName, res);
  }

  @Get('likedArticles')
  @HttpCode(HttpStatus.OK)
  async getLikedArticlesIds(@GetCurrentUserId() userId: string) {
    return await this.userService.getLikedArticlesIds(userId);
  }
}
