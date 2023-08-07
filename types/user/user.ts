import {
  ArticleEntity,
  CommentEntity,
} from '../../src/modules/article/entities';
import { UploadEntity } from '../../src/modules/upload/entities';

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
  createdAt: Date;
  modifiedAt: Date;
  likedArticles?: ArticleEntity[];
  comments?: CommentEntity[];
  profilePicture: UploadEntity;
}
