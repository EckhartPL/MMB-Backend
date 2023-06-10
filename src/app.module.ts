import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { GlobalExceptionFilter, GlobalResponseInterceptor } from './common';
import { ArticleModule } from './components/article/article.module';
import { AuthModule } from './components/auth/auth.module';
import { AtGuard } from './components/auth/guards';
import { UserModule } from './components/user/user.module';
import { envValidationObjectSchema } from './config';
import { DatabaseModule } from './database/database.module.';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationObjectSchema,
    }),
    ArticleModule,
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule {}
