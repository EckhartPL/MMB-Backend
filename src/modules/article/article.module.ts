import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { ArticleEntity } from './entities/article.entity';
import { CommentEntity } from './entities/comment.entity';
import { LikeService } from './like.service';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, LikeService, UserService, CommentService],
})
export class ArticleModule {}
