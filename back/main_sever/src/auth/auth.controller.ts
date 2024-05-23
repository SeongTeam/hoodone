import { AuthApiResponseDto } from 'hoodone-shared';

import {
    Controller,
    Post,
    Headers,
    Body,
    ValidationPipe,
    UseGuards,
    UseInterceptors,
    UseFilters,
    Get,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';

import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';

import { AuthUseCase } from './usecase/auth.use-case';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { BasicTokenGuard } from './guard/token/basic-token.guard';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { AuthException } from 'src/common/exception/auth-exception';
import { CommonExceptionFilter } from 'src/common/filter/common-exception.filter';
import { RefreshTokenGuard } from './guard/token/refresh-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { Logger } from '@nestjs/common';
import { TempUserUseCase } from 'src/users/usecase/temp-user.case';
import { retry } from 'rxjs';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authUseCase: AuthUseCase,
        private readonly userUseCase: UserUseCase,
        private readonly TempUserUseCase: TempUserUseCase,
    ) {}

    @Post('token/access')
    @UseGuards(RefreshTokenGuard)
    postTokenAccess(@Headers('authorization') rawToken: string) {
        const refreshToken = this.authUseCase.extractTokenFromHeader(rawToken, true);
        const newToken = this.authUseCase.rotateAccessToken(refreshToken);

        let res = new AuthApiResponseDto();
        res.postTokenAccess = newToken;

        return res;
    }

    @Post('token/refresh')
    @UseGuards(RefreshTokenGuard)
    postTokenRefresh(@Headers('authorization') rawToken: string) {
        const refreshToken = this.authUseCase.extractTokenFromHeader(rawToken, true);
        const newToken = this.authUseCase.rotateRefreshToken(refreshToken);

        let res = new AuthApiResponseDto();
        res.postTokenRefresh = newToken;
        return res;
    }

    @Post('/signup')
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(CommonExceptionFilter)
    async signUp(@Body(ValidationPipe) registerUserDto: RegisterUserDto, @QueryRunner() qr: QR) {
        Logger.log(`signUp() =>>> ${JSON.stringify(registerUserDto)}`);

        // TODO): 이메일과 닉네임 확인 로직은 서로 분리 시킬 예정
        const isEmailExist = await this.userUseCase.hasExistedEmail(registerUserDto.email);
        if (isEmailExist) throw new AuthException('EMAIL_EXISTS');
        const isNickNameExist = await this.userUseCase.hasExistedNickname(registerUserDto.nickname);
        if (isNickNameExist) throw new AuthException('NICKNAME_EXISTS');

        let res = new AuthApiResponseDto();
        res.postSignup = await this.authUseCase.registerWithEmail(registerUserDto, qr);

        return res;
    }

    @Post('/login/email')
    @UseGuards(BasicTokenGuard)
    @UseFilters(CommonExceptionFilter)
    async login(@Headers('authorization') rawToken: string) {
        const token = this.authUseCase.extractTokenFromHeader(rawToken, false);
        const credentials: AuthCredentialsDto = this.authUseCase.decodeBasicToken(token);

        let res = new AuthApiResponseDto();
        res.postLoginEmail = await this.authUseCase.loginWithEmail(credentials);

        return res;
    }

    @Post('send-pin-code')
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(CommonExceptionFilter)
    async sendPinCode(@Body() body, @QueryRunner() qr: QR) {
        /**reponse로 온 result의 response 안에
         * result[response] : '250 2.0.0 OK ... gsmpt가 들어 있으면 성골
         */
        const { toEmail } = body;

        return this.authUseCase.sendPinCode(toEmail, qr);
    }

    @Get('compare/tempuser-pin-code')
    async compareTempUserPinCode(@Body() body) {
        const { email, pinCode } = body;
        const result = await this.TempUserUseCase.comparePINCodes(body);
        if (result) {
            return {
                state: 200,
                message: '요청이 성공적으로 처리되었습니다.',
                result: result,
            };
        }
        return {
            state: 400,
            message: 'pinCode가 알맞지 않습니다.',
            result: result,
        };
    }
}
