import { UserEntity } from 'src/components/user/entities/user.entity';
export interface ArticleInterface {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  likes: number;
  user: UserEntity;
}

export interface GetPaginatedListOfArticlesResponse {
  items: ArticleInterface[];
  pagesCount: number;
  currentPage: number;
}

export interface CreateArticleResponse {
  title: string;
  description: string;
}

export interface LikeArticleId {
  likedArticle: string;
}

export interface ArticleLikeResponse {
  likes: number;
  likeFlag: boolean;
}
