import { Test, TestingModule } from '@nestjs/testing';

import { ArticleService } from '../article/article.service';

// eslint-disable-next-line max-lines-per-function
describe('MyService', () => {
  let service: ArticleService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService],
    }).compile();
    service = module.get<ArticleService>(ArticleService);
  });

  test('should return an object with items, pagesCount and currentPage properties', async () => {
    const result = await service.viewArticles();
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('pagesCount');
    expect(result).toHaveProperty('currentPage');
  });

  test('should return an array of 9 items when currentPage is 1', async () => {
    const result = await service.viewArticles(1);
    expect(result.items.length).toBe(9);
  });

  test('should return an array of items with the expected properties', async () => {
    const result = await service.viewArticles();
    const expectedProperties = [
      'id',
      'title',
      'description',
      'createdAt',
      'likes',
      'user',
    ];
    result.items.forEach((item) => {
      expectedProperties.forEach((property) => {
        expect(item).toHaveProperty(property);
      });
    });
  });

  test('should return a currentPage property of 1 if currentPage is greater than the count of articles', async () => {
    const result = await service.viewArticles(100);
    expect(result.currentPage).toBe(1);
  });

  test('should return a currentPage property equal to the input currentPage parameter', async () => {
    const result = await service.viewArticles(3);
    expect(result.currentPage).toBe(3);
  });

  test('should return a pagesCount property equal to the total number of pages of articles', async () => {
    const result = await service.viewArticles();
    expect(result.pagesCount).toBe(Math.ceil(result.items.length / 9));
  });
});
