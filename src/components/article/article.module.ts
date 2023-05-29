import { Module } from '@nestjs/common';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { LikeService } from './like.service';

import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, LikeService, UserService, CommentService],
})
export class ArticleModule {}
