import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtAuthGuard } from 'src/components/auth/guards/jwt-auth.guard';
import { GetCurrentUserId, Public } from 'src/decorators';
import { ValidatePagePipe } from 'src/pipes/validate-page.pipe';
import {
  ArticleInterface,
  CommentResponse,
  GetPaginatedListOfArticlesResponse,
  LikesResponse,
  commentsCounterResponse,
} from 'types';

import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { LikeService } from './like.service';

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
  @Get('comments-count/:articleId')
  commentsCounter(
    @Param('articleId') articleId: string,
  ): Promise<commentsCounterResponse> {
    return this.commentService.commentsCounter(articleId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:pageNumber')
  viewArticles(
    @Param('pageNumber', ValidatePagePipe) pageNumber: number,
  ): Promise<GetPaginatedListOfArticlesResponse> {
    return this.articleService.viewArticles(pageNumber);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createArticle(
    @Body() createArticle: CreateArticleDto,
    @GetCurrentUserId() userId: string,
  ): Promise<ArticleInterface> {
    return this.articleService.createArticle(createArticle, userId);
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
