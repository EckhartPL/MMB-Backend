import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  async profilePictureUpload(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });
    const extension = file.originalname.split('.').pop();
    const filename = `${uuid()}.${extension}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `avatars/${filename}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    const data = await s3.upload(params).promise();
    const user = await UserEntity.findOneByOrFail({ id: userId });
    if (user) {
      user.profilePictureUrl = data.Location;
      await user.save();
    }
    return data.Location;
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

  async removeLikedArticleQuery(
    userId: string,
    likedArticle: string,
  ): Promise<void> {
    await UserEntity.createQueryBuilder('user')
      .relation(UserEntity, 'likedArticles')
      .of(userId)
      .remove(likedArticle);
  }
}
