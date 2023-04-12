import { CommentEntity } from 'src/components/article/entities/comment.entity';

export interface CommentResponse {
  items: CommentEntity[];
  pagesCount?: number;
  currentPage?: number;
}
