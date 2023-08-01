import { CommentEntity } from '../../src/modules/article/entities/comment.entity';

export interface CommentResponse {
  items: CommentEntity[];
  pagesCount?: number;
  currentPage?: number;
}

export interface CommentsCountResponse {
  commentsCount: number;
}
