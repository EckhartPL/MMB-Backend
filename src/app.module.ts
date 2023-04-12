import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArticleModule } from './components/article/article.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import dbConfiguration from '../src/config/db.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppService } from './app.service';
import { AtGuard } from './components/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    ArticleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    // {
    // provide: APP_INTERCEPTOR,
    // useClass: AuthInterceptor,
    // }
  ],
})
export class AppModule {}
