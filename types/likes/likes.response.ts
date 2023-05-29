import { ArticleEntity } from 'src/components/article/entities/article.entity';

export interface LikesResponse {
  likes: number;
  article: ArticleEntity | boolean;
}
