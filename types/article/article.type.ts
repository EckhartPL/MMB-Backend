import { UserEntity } from 'src/components/user/entities/user.entity';

export interface ArticleInterface {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  likes: number;
  user: UserEntity;
}

export interface LikeArticleId {
  likedArticle: string;
}
