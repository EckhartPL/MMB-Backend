import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ArticleService } from 'src/modules/article/article.service';

@Injectable()
export class ValidatePagePipe implements PipeTransform {
  constructor(@Inject(ArticleService) private articleService: ArticleService) {}
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<number> {
    Logger.log(metadata);
    const { pagesCount } = await this.articleService.viewArticles();
    const page = Number(value);

    if (Number.isNaN(page) || page < 1 || page > pagesCount) {
      throw new BadRequestException(
        'Page must be numeric string, bigger than 0 and less than max pages.',
      );
    }
    return page;
  }
}
