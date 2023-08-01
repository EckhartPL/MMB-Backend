import { ArticleInterface } from 'types';

export interface GetPaginatedListOfArticlesResponse {
  items: ArticleInterface[];
  pagesCount: number;
  currentPage: number;
}

export interface CreateArticleResponse {
  title: string;
  description: string;
}

export interface ArticleLikeResponse {
  likes: number;
  likeFlag: boolean;
}
