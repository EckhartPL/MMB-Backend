import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // secret: jwtConstants.secret,
      // signOptions: {expiresIn: '24h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
