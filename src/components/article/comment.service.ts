import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentResponse, CommentsCounterResponse } from 'types';

import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(private readonly dataSource: DataSource) {}
  // # Write a method that adds comments to an article

  // eslint-disable-next-line max-lines-per-function
  async comments(articleId: string): Promise<CommentResponse> {
    const [items, count] = await this.dataSource
      .createQueryBuilder()
      .from(CommentEntity, 'comment')
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

  async commentsCounter(articleId: string): Promise<CommentsCounterResponse> {
    const [, count] = await this.dataSource
      .createQueryBuilder()
      .from(CommentEntity, 'comment')
      .leftJoinAndSelect('comment.article', 'article')
      .select(['comment.id'])
      .where('article.id = :id', { id: articleId })
      .getManyAndCount();

    return {
      articleCommentsQuantity: count,
    };
  }
}
