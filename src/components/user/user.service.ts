import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';

@Injectable()
export class UserService {
  async profilePictureUpload(file: Express.Multer.File, userId: string) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });
    const extension = file.originalname.split('.').pop();
    const filename = uuid() + '.' + extension;

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

    return { url: data.Location };
  }

  async getUser(username: string, res: Response) {
    const user = await UserEntity.findOneBy({ name: username });
    if (!user) {
      throw new NotFoundException(
        `User with provided username ${username} does not exist`,
      );
    }
    res.json({
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
    });
  }

  async getLikedArticlesIds(userId: string) {
    const likedArticles = await UserEntity.createQueryBuilder('user')
      .leftJoinAndSelect('user.likedArticles', 'likedArticle')
      .select(['likedArticle.id'])
      .where('user.id = :id', { id: userId })
      .getMany();

    return { likedArticles };
  }
}
