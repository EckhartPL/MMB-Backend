import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetPaginatedListOfArticlesResponse, LikeArticleId } from 'types';
import { ValidatePagePipe } from 'src/pipes/validate-page.pipe';
import { JwtAuthGuard } from 'src/components/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { GetCurrentUserId, Public } from 'src/decorators';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('comments/:articleId')
  async comments(@Param('articleId') articleId: string) {
    return this.articleService.comments(articleId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('comments-count/:articleId')
  async commentsCounter(@Param('articleId') articleId: string) {
    return this.articleService.commentsCounter(articleId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:pageNumber')
  async viewArticles(
    @Param('pageNumber', ValidatePagePipe) pageNumber: number,
  ): Promise<GetPaginatedListOfArticlesResponse> {
    return await this.articleService.viewArticles(pageNumber);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Body() createArticle: CreateArticleDto,
    @Res() res: Response,
    @GetCurrentUserId() userId: string,
  ) {
    return await this.articleService.createArticle(createArticle, userId, res);
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async likeArticle(
    @GetCurrentUserId() userId: string,
    @Body() likedArticle: LikeArticleId,
    @Res() res: Response,
  ): Promise<void> {
    return await this.articleService.like(userId, likedArticle, res);
  }
}
