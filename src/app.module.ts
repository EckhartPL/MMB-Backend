import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
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
  ],
})
export class AppModule {}
