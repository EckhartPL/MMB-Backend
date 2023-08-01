import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import { UserResponse } from 'types/user';

export interface LikesResponse {
  article: ArticleEntity;
  user: UserResponse;
  isLiked: boolean;
}
