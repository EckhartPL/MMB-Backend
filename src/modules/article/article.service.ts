import { Injectable, Logger } from '@nestjs/common';
import { Filtering, Pagination, Sorting } from 'src/decorators';
import { getOrder, getWhere } from 'src/utils';
import { DataSource } from 'typeorm';
import { GetPaginatedListOfArticlesResponse, PaginatedResource } from 'types';

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

    const [articles, count] = await this.dataSource
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

    const pagesCount = Math.ceil(count / maxPerPage);

    return {
      articles,
      pagesCount,
      currentPage: currentPage > pagesCount ? (currentPage = 1) : currentPage,
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

  // eslint-disable-next-line max-lines-per-function
  async searchArticles(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<ArticleEntity>>> {
    const where = getWhere(filter);
    const order = JSON.stringify(getOrder(sort));

    const [articles, total] = await this.dataSource
      .createQueryBuilder()
      .from(ArticleEntity, 'article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .skip(offset)
      .take(limit)
      .where(where)
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
      .orderBy(
        `article.${sort.property}`,
        sort.direction.toUpperCase() as 'ASC' | 'DESC',
      )
      .getManyAndCount();

    Logger.warn(total, page, size, order);

    return {
      totalItems: total,
      items: articles,
      page,
      size,
      order,
    };
  }
}
