import { Injectable, Logger } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';
import { CommentCounterResponse } from 'types';

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
    Logger.log('items:', { items }, 'count:', count);
    return {
      items,
      count,
    };
  }

  async commentsCounter(articleId: string): Promise<CommentCounterResponse> {
    const [, count] = await CommentEntity.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .select(['comment.id'])
      .where('article.id = :id', { id: articleId })
      .getManyAndCount();

    Logger.log('count:', count);

    return {
      count,
    };
  }
}
