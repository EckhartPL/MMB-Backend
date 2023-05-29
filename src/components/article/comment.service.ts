import { Injectable } from '@nestjs/common';
import { CommentResponse, commentsCounterResponse } from 'types';

import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  async comments(articleId: string): Promise<CommentResponse> {
    const [items, count] = await CommentEntity.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.article', 'article')
      .select([
        'comment.id',
        'comment.content',
        'article.id',
        'article.title',
        'article.description',
        'article.createdAt',
        'article.likes',
        'user.id',
        'user.name',
        'user.profilePictureUrl',
      ])
      .where('article.id = :id', { id: articleId })
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();
    return {
      items,
      pagesCount: count,
    };
  }

  async commentsCounter(articleId: string): Promise<commentsCounterResponse> {
    const [, count] = await CommentEntity.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .select(['comment.id'])
      .where('article.id = :id', { id: articleId })
      .getManyAndCount();

    return {
      pagesCount: count,
    };
  }
}
