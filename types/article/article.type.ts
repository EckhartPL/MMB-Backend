import { UserInterface } from 'types';

export interface ArticleInterface {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  likes: number;
  user: UserInterface;
}

export interface LikeArticleId {
  likedArticle: string;
}
