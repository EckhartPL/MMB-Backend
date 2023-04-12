import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './entities/article.entity';
import { GetPaginatedListOfArticlesResponse, LikeArticleId } from 'types';
import { CreateArticleDto } from './dto/create-article.dto';
import { Response } from 'express';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { CommentResponse } from 'types/comment';

@Injectable()
export class ArticleService {
  async viewArticles(
    currentPage = 1,
  ): Promise<GetPaginatedListOfArticlesResponse> {
    if (currentPage < 1) {
      currentPage = 1;
    }

    const maxPerPage = 9;

    const [items, count] = await ArticleEntity.createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .skip(maxPerPage * (currentPage - 1))
      .take(maxPerPage)
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.createdAt',
        'article.likes',
        'user.id',
        'user.name',
        'user.profilePictureUrl',
      ])
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();

    const pagesCount = Math.ceil(count / maxPerPage);

    if (currentPage > count) {
      currentPage = 1;
    }
    return {
      items,
      pagesCount,
      currentPage,
    };
  }

  async createArticle(
    createArticle: CreateArticleDto,
    userId: string,
    res: Response,
  ) {
    const article = new ArticleEntity();
    const user = await UserEntity.findOneBy({ id: userId });
    article.title = createArticle.title;
    article.description = createArticle.description;
    article.user = user;
    await article.save();

    return res.json({ ok: true });
  }

  async comments(): Promise<CommentResponse> {
    const maxPerPage = 9;

    const [items, count] = await CommentEntity.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.article', 'article')
      .take(maxPerPage)
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
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();

    const pagesCount = Math.ceil(count / maxPerPage);

    return {
      items,
      pagesCount,
    };
  }

  async like(
    userId: string,
    likedArticle: LikeArticleId,
    res: Response,
  ): Promise<void> {
    const user = await UserEntity.findOne({
      where: {
        id: userId,
      },
      relations: ['likedArticles'],
    });
    const article = await ArticleEntity.findOneBy({
      id: likedArticle.likedArticle,
    });

    if (!user) {
      return null;
    }
    if (user.likedArticles.some((el) => el.id === article.id)) {
      await UserEntity.createQueryBuilder('user')
        .relation(UserEntity, 'likedArticles')
        .of(userId)
        .remove(likedArticle.likedArticle);
      article.likes--;
      await article.save();
      res.json({
        likes: article.likes,
        article: null,
      });
    } else {
      user.likedArticles.push(article);
      article.likes++;
      await user.save();
      await article.save();
      res.json({
        likes: article.likes,
        article,
      });
    }
  }
}
