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

  // eslint-disable-next-line max-lines-per-function
  async like(userId: string, likedArticleId: string): Promise<LikesResponse> {
    const article = await this.articleService.getArticleById(likedArticleId);
    const user = await this.userService.getUserById(userId);

    if (user.likedArticles.some((el) => el.id === article.id)) {
      const newLikedArticles = user.likedArticles.filter((el) => {
        return el.id !== article.id;
      });
      user.likedArticles = newLikedArticles;
      await user.save();
      article.likes--;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pwdHash, hashedRt, ...filteredUser } = user;
      await article.save();
      return {
        article,
        user: filteredUser,
        isLiked: false,
      };
    }
    user.likedArticles.push(article);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pwdHash, hashedRt, ...filteredUser } = user;
    article.likes++;
    await Promise.all([user.save(), article.save()]);
    return {
      article,
      user: filteredUser,
      isLiked: true,
    };
  }
}
