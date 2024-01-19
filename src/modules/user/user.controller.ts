import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UserUpdateResponse } from 'types';

import { UpdateUserDto } from './dto/update.dto';
import { UserService } from './user.service';

import { GetCurrentUserId } from '../../decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('likedArticles')
  @HttpCode(HttpStatus.OK)
  getLikedArticlesIds(@GetCurrentUserId() userId: string): Promise<string[]> {
    return this.userService.getLikedArticlesIds(userId);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  updateUserInfo(
    @GetCurrentUserId() userId: string,
    @Body() updatedInfo: UpdateUserDto,
  ): Promise<UserUpdateResponse> {
    return this.userService.updateUserInfo(userId, updatedInfo);
  }
}
