import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  // const reflector = new Reflector();
  // app.useGlobalGuards(new AtGuard(reflector));
  await app.listen(3001);
}
bootstrap();
