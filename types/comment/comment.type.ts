import { ArticleInterface, UserInterface } from 'types';

export interface CommentResponse {
  items: CommentInterface[];
  pagesCount?: number;
  currentPage?: number;
}

export interface CommentInterface {
  id: string;
  content: string;
  user: UserInterface;
  article: ArticleInterface;
}

export interface CommentsCountResponse {
  commentsCount: number;
}
