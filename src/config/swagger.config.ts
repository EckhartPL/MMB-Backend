import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('MMBlog API')
  .setTitle('MMBlog API documentation')
  .setVersion('1.0')
  .build();
