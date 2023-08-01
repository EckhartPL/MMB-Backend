import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { GlobalResponseInterceptor } from './common';
import { envValidationObjectSchema } from './config';
import { DatabaseModule } from './database/database.module.';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { AtGuard } from './modules/auth/guards';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';

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
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionFilter,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule {}
