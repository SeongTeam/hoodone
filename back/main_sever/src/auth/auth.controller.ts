import {
  Controller,
  Post,
  Headers,
  Body,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';

import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';

import { AuthUseCase } from './usecase/auth.use-case';
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { AuthException } from 'src/common/exception/auth-exception';
import { CommonExceptionFilter } from 'src/common/filter/common-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly userUseCase: UserUseCase,
  ) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authUseCase.extractTokenFromHeader(rawToken, true);

    const newToken = this.authUseCase.rotateToken(token, false);

    /**
     * {accessToken: {token}}
     */
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authUseCase.extractTokenFromHeader(rawToken, true);

    console.log(`token ===>> ${token}`);

    const newToken = this.authUseCase.rotateToken(token, true);

    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  @Post('/signup')
  @UseInterceptors(TransactionInterceptor)
  @UseFilters(CommonExceptionFilter)
  async signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto, @QueryRunner() qr: QR) {
    // todo 이메일과 닉네임 확인 로직은 서로 분리 시킬 예정
    const isEmailExist = await this.userUseCase.checkEmailExist(registerUserDto.email);
    if (isEmailExist) throw new AuthException('EMAIL_EXISTS');
    const isNickNameExist = await this.userUseCase.checkNickNameExist(registerUserDto.nickName);
    if (isNickNameExist) throw new AuthException('NICKNAME_EXISTS');

    return this.authUseCase.registerWithEmail(registerUserDto, qr);
  }

  @Post('/login/email')
  @UseGuards(BasicTokenGuard)
  login(@Headers('authorization') rawToken: string) {
    const token = this.authUseCase.extractTokenFromHeader(rawToken, false);

    const credentials: AuthCredentialsDto = this.authUseCase.decodeBasicToken(token);

    return this.authUseCase.loginWithEmail(credentials);
  }
}
