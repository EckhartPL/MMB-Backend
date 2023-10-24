import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { hashPwd } from 'src/utils/hash-pwd';
import { LoginResponse, Tokens, UserObj } from 'types';

import { jwtConstants } from './constants';
import { AuthLoginDto } from './dto/auth-login.dto';

import { RegisterDto } from '../user/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<UserObj | null> {
    const user = await UserEntity.findOneBy({ email });
    const hashedPwd = hashPwd(pass);
    if (user && user.pwdHash === hashedPwd) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pwdHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: AuthLoginDto): Promise<LoginResponse> {
    const user = await UserEntity.findOne({
      where: {
        email: dto.email,
      },
      relations: {
        likedArticles: true,
        profilePicture: true,
      },
    });

    if (!user) return null;
    this.validateUser(dto.email, dto.password);
    delete user.pwdHash;
    delete user.hashedRt;

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return {
      tokens,
      user,
    };
  }

  // eslint-disable-next-line max-lines-per-function
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.SECRET_AT,
          expiresIn: jwtConstants.atExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.SECRET_RT,
          expiresIn: jwtConstants.rtExpiresIn,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async register(data: RegisterDto): Promise<Tokens | null> {
    let user = await UserEntity.findOneBy({ email: data.email });
    if (user) {
      return null;
    }

    user = new UserEntity();
    user.email = data.email;
    user.pwdHash = hashPwd(data.password);
    await user.save();
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<void | null> {
    const user = await UserEntity.findOneBy({ id: userId });
    if (user.hashedRt) {
      user.hashedRt = null;
      await user.save();
    }
    return null;
  }

  private async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    const user = await UserEntity.findOneBy({ id: userId });
    user.hashedRt = hash;
    await user.save();
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await UserEntity.findOneBy({ id: userId });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied!');
    // const rtMatches = await argon.verify(user.hashedRt, rt.slice(7));
    const rtMatches = await argon.verify(user.hashedRt, rt);
    Logger.log(rtMatches);
    if (!rtMatches)
      throw new ForbiddenException('Refresh Token does not match!');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  decodeToken(token: string):
    | null
    | {
        [key: string]: unknown;
      }
    | string {
    return this.jwtService.decode(token);
  }
}
