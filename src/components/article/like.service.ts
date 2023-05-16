import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleEntity } from './entities/article.entity';
import { LikeArticleId } from 'types';
import { LikesResponse } from 'types/likes/likes.response';

@Injectable()
export class LikeService {
  async like(userId: string, likedArticle: LikeArticleId): Promise<LikesResponse> {
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
      return {
        likes: article.likes,
        article: null,
      }
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
