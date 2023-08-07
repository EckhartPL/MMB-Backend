import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

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
}
