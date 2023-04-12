import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/components/user/entities/user.entity';
import { hashPwd } from 'src/utils/hash-pwd';
import { LoginResponse, Tokens } from 'types';
import { RegisterDto } from '../user/dto/register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await UserEntity.findOne({ where: { email: email } });
    const hashedPwd = hashPwd(pass);
    if (user && user.pwdHash === hashedPwd) {
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
      },
    });

    if (!user) throw new ForbiddenException('Access Denied!');
    this.validateUser(dto.email, dto.password);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return {
      tokens,
      user: {
        email: user.email,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        likedArticles: user.likedArticles,
      },
    };
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.SECRET_AT,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.SECRET_RT,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async register(data: RegisterDto): Promise<Tokens> {
    let user = await UserEntity.findOneBy({ email: data.email });
    if (user) {
      throw new ForbiddenException(
        'Account with provided email already exists.',
      );
    }

    user = new UserEntity();
    user.email = data.email;
    user.pwdHash = hashPwd(data.password);
    await user.save();
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    const user = await UserEntity.findOneBy({ id: userId });
    if (user.hashedRt) {
      user.hashedRt = null;
      await user.save();
    }
    return null;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await argon.hash(rt);
    const user = await UserEntity.findOneBy({ id: userId });
    user.hashedRt = hash;
    await user.save();
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await UserEntity.findOneBy({ id: userId });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied!');
    // console.log(user.hashedRt, '\nrt:\n', rt.slice(7));
    const rtMatches = await argon.verify(user.hashedRt, rt.slice(7));
    // console.log('\nrtMatches:\n', rtMatches);
    if (!rtMatches)
      throw new ForbiddenException('Refresh Token does not match!');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  decodeToken(token): any {
    return this.jwtService.decode(token);
  }
}
