import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserUpdateResponse } from 'types';

import { UpdateUserDto } from './dto/update.dto';
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

  getUserByName(name: string): Promise<UserEntity> {
    return UserEntity.findOneBy({ name });
  }

  async getLikedArticlesIds(userId: string): Promise<string[]> {
    return (
      await UserEntity.findOne({
        where: { id: userId },
        relations: { likedArticles: true },
      })
    ).likedArticles.map((likedArticle) => likedArticle.id);
  }

  async updateUserInfo(
    userId: string,
    updatedInfo: UpdateUserDto,
  ): Promise<UserUpdateResponse> {
    const userName = await this.getUserByName(updatedInfo.name);
    if (userName) return { exists: true };
    const user = await this.getUserById(userId);
    user.name = updatedInfo.name;
    await user.save();
  }
}
