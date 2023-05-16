import { CommentEntity } from 'src/components/article/entities/comment.entity';

export interface CommentResponse {
  items: CommentEntity[];
  count: number;
}

export interface CommentCounterResponse {
  count: number;
}
