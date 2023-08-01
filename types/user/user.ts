import { ArticleEntity, CommentEntity } from 'src/modules/article/entities';

export interface UserObj {
  id?: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  likedArticles?: ArticleEntity[];
  comments?: CommentEntity[];
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  pwdHash: string;
  profilePictureUrl: string;
  likedArticles?: ArticleEntity[];
  comments?: CommentEntity[];
}
