import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './entities/article.entity';
import { GetPaginatedListOfArticlesResponse } from 'types';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  // eslint-disable-next-line max-lines-per-function
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
  ): Promise<boolean> {
    const article = new ArticleEntity();
    const user = await UserEntity.findOneBy({ id: userId });
    article.title = createArticle.title;
    article.description = createArticle.description;
    article.user = user;
    await article.save();

    return { ok: true };
  }
}
