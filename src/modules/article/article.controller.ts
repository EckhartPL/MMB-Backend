import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import {
  CommentResponse,
  LikesResponse,
  GetPaginatedListOfArticlesResponse,
} from 'types';

import { ArticleService } from './article.service';
import { CommentService } from './comment.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { LikeService } from './like.service';

import { GetCurrentUserId, Public } from '../../decorators';
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
