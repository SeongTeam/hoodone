import { Controller, Post, Headers, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, RegisterUserDto } from './dto/auth-credential.dto';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

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
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    console.log(`token ===>> ${token}`);

    const newToken = this.authService.rotateToken(token, true);

    /**
     * {refreshToken: {token}}
     */
    return {
      refreshToken: newToken,
    };
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerUserDto);
  }

  @Post('/login/email')
  @UseGuards(BasicTokenGuard)
  login(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials: AuthCredentialsDto = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }
}
