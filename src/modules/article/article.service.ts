import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetPaginatedListOfArticlesResponse } from 'types';

import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities/article.entity';

import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(private readonly dataSource: DataSource) {}

  // eslint-disable-next-line max-lines-per-function
  async viewArticles(
    currentPage = 1,
  ): Promise<GetPaginatedListOfArticlesResponse> {
    currentPage < 1 ? (currentPage = 1) : currentPage;
    const maxPerPage = 9;

    const [items, count] = await this.dataSource
      .createQueryBuilder()
      .from(ArticleEntity, 'article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
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
        'profilePicture.url',
      ])
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      pagesCount: Math.ceil(count / maxPerPage),
      currentPage: currentPage > count ? (currentPage = 1) : currentPage,
    };
  }

  async createArticle(
    { title, description }: CreateArticleDto,
    userId: string,
  ): Promise<void> {
    const user = await UserEntity.findOneBy({ id: userId });
    await ArticleEntity.create({
      title,
      description,
      user,
    }).save();
  }

  async deleteArticle(articleId: string): Promise<void> {
    await ArticleEntity.delete(articleId);
  }

  getArticleById(articleId: string): Promise<ArticleEntity> {
    return ArticleEntity.findOneBy({ id: articleId });
  }
}
