import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GetCurrentUserId } from 'src/decorators';

import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/upload/:userName')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('userName') userName: string): Promise<UserEntity> {
    return this.userService.getUserByName(userName);
  }

  @Get('likedArticles')
  @HttpCode(HttpStatus.OK)
  getLikedArticlesIds(@GetCurrentUserId() userId: string): Promise<string[]> {
    return this.userService.getLikedArticlesIds(userId);
  }
}
