import { Inject, Injectable } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { UnauthorizedException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { AuthException } from 'src/common/exception/auth-exception';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { UserModel } from 'src/users/entities/user.entity';

import { AuthService } from '../auth.service';
import { AuthCredentialsDto, RegisterUserDto } from '../dto/auth-credential.dto';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userUseCase: UserUseCase,
  ) {}

  /**
   * Header에서 토큰 추출
   *
   * {authorization: 'Basic {token}'} 처음에 로그인할 떄 사용 또는
   * {authorization: 'Bearer {token}'} access 또는 refresh 토큰 일때 사용
   */
  extractTokenFromHeader(header: string, isBearer: boolean): string {
    // 'Basic {token}'  split 결과 =>  [Basic, {token}]
    // 'Bearer {token}' split 결고 => [Bearer, {token}]
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    // splitToken의 길이는 항상 2 ||
    // prefix는 'Bearer'또는 'Basic' 인데 splitToken[0]은 아닐 수 있어서
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new AuthException('JWT_INVALID_TOKEN');
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(base64String: string): { email: string; password: string } {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new AuthException('JWT_INVALID_TOKEN');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  rotateToken(token: string, isRefreshToken: boolean): string {
    return this.authService.rotateToken(token, isRefreshToken);
  }

  /**
   * 토큰 검증
   */
  verifyToken(token: string): string | any {
    return this.authService.verifyToken(token);
  }

  async loginWithEmail(
    dtoData: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userUseCase.getUserByEmail(dtoData.email);

    if (existingUser) {
      const is = await this.authService.authenticateWithEmailAndPassword(dtoData, existingUser);

      return {
        accessToken: this.authService.signToken(existingUser, false),
        refreshToken: this.authService.signToken(existingUser, true),
      };
    }
  }

  async registerWithEmail(
    userInfo: Pick<UserModel, 'email' | 'nickName' | 'password'>,
    qr: QueryRunner,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    /**회원가입을 완료하면 자동으로 로그인  */

    const hash = await this.authService.inCodingPassword(userInfo);
    const newUser: UserModel = await this.userUseCase.createNewUser(
      {
        ...userInfo,
        password: hash,
      },
      qr,
    );
    if (newUser === null)
      throw new AuthException('ACCOUNT_CREATION_FAILED', {
        message: 'registerWithEmail() => UserModel 실행 실패 ',
      });
    return this.loginWithEmail({ email: userInfo.email, password: userInfo.password });
  }
}
