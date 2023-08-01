import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { createWriteStream } from 'fs';
import { extname } from 'path';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}
  async uploadProfilePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UserEntity> {
    const user = await this.getUserById(userId);
    const extension = extname(file.originalname);
    const fileName = `${uuid()}${extension}`;
    const uploadPath = `./uploads/${fileName}`;

    return new Promise((resolve, reject) =>
      createWriteStream(uploadPath)
        .on('finish', () => {
          // Update the user's profilePicture property with the new filename
          user.profilePictureUrl = fileName;
          resolve(user);
        })
        .on('error', (error) => {
          // Handle the error appropriately
          reject(error);
        })
        .end(file.buffer),
    );
  }

  async getUserByName(username: string): Promise<UserEntity> {
    const user = await UserEntity.findOneBy({ name: username });
    if (!user) {
      throw new NotFoundException(
        `User with provided username ${username} does not exist`,
      );
    }
    return user;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({
      where: { id: userId },
      relations: { likedArticles: true },
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
