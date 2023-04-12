import { ArticleEntity } from 'src/components/article/entities/article.entity';

export interface UserObj {
  id?: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  likedArticles?: ArticleEntity[];
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  pwdHash: string;
  profilePictureUrl: string;
  likedArticles: ArticleEntity[];
}

export interface RegisterUserResponse {
  id: string;
  email: string;
}
