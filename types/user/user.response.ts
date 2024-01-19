import {
  CommentEntity,
  ArticleEntity,
} from '../../src/modules/article/entities';
import { UploadEntity } from '../../src/modules/upload/entities';
export interface RegisterUserResponse {
  id: string;
  email: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  likedArticles?: ArticleEntity[];
  comments?: CommentEntity[];
  article?: ArticleEntity[];
  profilePicture?: UploadEntity;
}

export interface UserUpdateResponse {
  exists: boolean;
}
