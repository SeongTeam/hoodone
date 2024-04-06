import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import {
  ENV_AUTH_SALT2024_KEY,
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_SECRET_KEY,
} from 'src/common/const/env-keys.const';
import { UserModel } from 'src/users/entities/user.entity';
import { AuthException } from 'src/common/exception/auth-exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Basic al;sdkfjoiasdjlzkxcjvsdf와 같은 형태의 header decode
  
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new AuthException('JWT_TOKEN_FORMAT_ERROR');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  /**
   * 토큰 검증
   */
  verifyToken(token: string): string | any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (e) {
      throw new AuthException('JWT_INVALID_TOKEN');
    }
  }
  /**
   * refresh 토큰을 매게변수로 받아서 새로운 access 토큰을 출력
   *
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      complete: true,
    });

    /**
     * sub: id
     * email: email,
     * type: 'access' | 'refresh'
     */
    if (decoded.payload.type !== 'refresh') {
      throw new AuthException('ACCESS_TOKEN_TYPE_MISMATCH');
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
  // todo bcript를 사용하자 단 너무 느게리게 사용하지 말고
  // salt를 잘 사용하고 주기적으로 salt를 바꿔주자
  async authenticateWithEmailAndPassword(
    userInfo: Pick<UserModel, 'email' | 'password'>,
    existingUser: UserModel,
  ) {
    const passOk = await bcrypt.compare(
      `${userInfo.password}${this.configService.get<string>(ENV_AUTH_SALT2024_KEY)}`,
      existingUser.password,
    );
    if (!passOk) {
      throw new AuthException('INCORRECT_PASSWORD');
    }

    return passOk;
  }

  /**
   * jwt Payload에 들어갈 정보
   *
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   *
   * {email: string, id: number}
   */
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean): string {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    const newToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      // seconds
      expiresIn: isRefreshToken ? 3600 : 300, // 토큰 타입에 따라 기간을 다르게 설정
    });

    return newToken;
  }

  // todo 함수 이름 변경
  async inCodingPassword(user: Pick<UserModel, 'password'>): Promise<string> {
    return await bcrypt.hash(
      `${user.password}${this.configService.get<string>(ENV_AUTH_SALT2024_KEY)}`,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
    );
  }
}
