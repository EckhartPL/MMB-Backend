import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({
      where: { id: userId },
      relations: { likedArticles: true, profilePicture: true },
    });
    if (!user) {
      throw new NotFoundException(
        `User with provided id ${userId} does not exist`,
      );
    }
    return user;
  }

  async getLikedArticlesIds(userId: string): Promise<string[]> {
    return (
      await UserEntity.findOne({
        where: { id: userId },
        relations: { likedArticles: true },
      })
    ).likedArticles.map((likedArticle) => likedArticle.id);
  }
}
