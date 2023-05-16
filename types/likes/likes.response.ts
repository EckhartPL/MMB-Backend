import { ArticleEntity } from "src/components/article/entities/article.entity";

export type LikesResponse = {
  likes: number,
  article: boolean | ArticleEntity,
};
