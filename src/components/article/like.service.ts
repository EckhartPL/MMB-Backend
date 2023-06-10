import { Injectable } from '@nestjs/common';
import { LikesResponse } from 'types';

import { ArticleService } from './article.service';

import { UserService } from '../user/user.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  async like(userId: string, likedArticleId: string): Promise<LikesResponse> {
    const user = await this.userService.getUserById(userId);
    const article = await this.articleService.getArticleById(likedArticleId);

    if (user.likedArticles.some((el) => el.id === article.id)) {
      await this.userService.removeLikedArticleQuery(userId, likedArticleId);
      article.likes--;
      await article.save();
      return {
        likes: article.likes,
        article: null,
      };
    }
    user.likedArticles.push(article);
    article.likes++;
    await user.save();
    await article.save();
    return {
      likes: article.likes,
      article,
    };
  }
}
