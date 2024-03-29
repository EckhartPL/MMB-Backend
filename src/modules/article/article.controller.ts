import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import {
  CommentResponse,
  LikesResponse,
  GetPaginatedListOfArticlesResponse,
  PaginatedResource,
} from 'types';

import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities';
import { LikeService } from './like.service';

import {
  Filtering,
  FilteringParams,
  GetCurrentUserId,
  Pagination,
  PaginationParams,
  Public,
  Sorting,
  SortingParams,
} from '../../decorators';
import { ValidatePagePipe } from '../../pipes/validate-page.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('comments/:articleId')
  comments(@Param('articleId') articleId: string): Promise<CommentResponse> {
    return this.commentService.comments(articleId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('comments/count/:articleId')
  commentsCounter(@Param('articleId') articleId: string): Promise<number> {
    return this.commentService.commentsCount(articleId);
  }

  @Public()
  @Get('/search')
  @HttpCode(HttpStatus.OK)
  public async searchArticles(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['title', 'createdAt', 'likes']) sort?: Sorting,
    @FilteringParams(['title', 'createdAt', 'likes']) filter?: Filtering,
  ): Promise<PaginatedResource<Partial<ArticleEntity>>> {
    return await this.articleService.searchArticles(
      paginationParams,
      sort,
      filter,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:pageNumber')
  viewArticles(
    @Param('pageNumber', ValidatePagePipe) pageNumber: number,
  ): Promise<GetPaginatedListOfArticlesResponse> {
    return this.articleService.viewArticles(pageNumber);
  }

  @Post('/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createArticle(
    @Body() createArticle: CreateArticleDto,
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    return this.articleService.createArticle(createArticle, userId);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(articleId: string): Promise<void> {
    await this.articleService.deleteArticle(articleId);
  }

  @Post('/like/:likedArticleId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  likeArticle(
    @GetCurrentUserId() userId: string,
    @Param('likedArticleId') likedArticleId: string,
  ): Promise<LikesResponse> {
    return this.likeService.like(userId, likedArticleId);
  }
}
