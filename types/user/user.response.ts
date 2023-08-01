import { CommentEntity } from '../../src/modules/article/entities';
import { ArticleEntity } from '../../src/modules/article/entities/article.entity';
export interface RegisterUserResponse {
  id: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
  createdAt: Date;
  likedArticles?: ArticleEntity[];
  comments?: CommentEntity[];
  article?: ArticleEntity[];
}
