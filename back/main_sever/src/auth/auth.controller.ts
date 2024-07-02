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
    Patch,
    NotFoundException,
    BadRequestException,
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
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { AccessTokenGuard } from './guard/token/access-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { emit } from 'process';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authUseCase: AuthUseCase,
        private readonly userUseCase: UserUseCase,
        private readonly tempUserUseCase: TempUserUseCase,
    ) {}

    @Get('/identify')
    @UseGuards(AccessTokenGuard)
    async identifyUser(@User('id') userId: number) {
        let res = new AuthApiResponseDto();
        res.identify = await this.userUseCase.getUserById(userId);

        return res;
    }

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
    async sendSignUpPinCode(@Body() body, @QueryRunner() qr: QR) {
        /**reponse로 온 result의 response 안에
         * result[response] : '250 2.0.0 OK ... gsmpt가 들어 있으면 성골
         */
        const { toEmail } = body;
        const result = await this.authUseCase.sendSingUpPinCode(toEmail, qr);
        let res = new AuthApiResponseDto();

        res.sendSignUpPinCode = typeof result.response === 'string' ? result.response : '';
        return res;
    }
    //  response: '250 2.0.0 OK  1716551382 d2e1a72fcca58-6f8fcbea886sm952420b3a.137 - gsmtp',
    @Post('compare/tempuser-pin-code')
    async compareTempUserPinCode(@Body() body) {
        const { email, pinCode } = body;
        console.log(body);
        const result = await this.tempUserUseCase.comparePinCodes({ email, pinCode });
        let res = new AuthApiResponseDto();

        console.log(`result ===> ${result}`);
        if (res) {
            res.getCompareTempUserPinCode = {
                statusCode: 200,
                message: 'Your request has been processed successfully.',
                result,
            };
        }
        res.getCompareTempUserPinCode = {
            statusCode: 400,
            message: 'Not a valid pinCode',
            result,
        };

        return res;
    }

    @Patch('reset-password')
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(CommonExceptionFilter)
    async resetPassword(@Body(ValidationPipe) dto: ResetPasswordRequestDto, @QueryRunner() qr: QR) {
        /**`TODO 추후에 링크로 사용할 로직이기에 controller에서 기능을 정의했습니다. */
        const { email, password, pinCode } = dto;

        const user = await this.userUseCase.getUserByEmail(email);
        const split = user.verificationToken.split('||');
        const targetTime: Date = new Date(`${split[1]}`);
        const currentTime: Date = new Date();
        const timeDifferenceInMinutes: number = Math.abs(
            (currentTime.getTime() - targetTime.getTime()) / (1000 * 60),
        );

        if (!user) {
            throw new NotFoundException('존재하지 않는 ID 입니다');
        }

        if (split[0] != pinCode || timeDifferenceInMinutes > 5) {
            throw new BadRequestException('유요하지 않은 pinCode');
        }

        const result = await this.authUseCase.resetPassword({ password, id: user.id }, qr);
        return result;
    }

    @Patch('send-password-reset-link')
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(CommonExceptionFilter)
    async sendPasswordResetLink(@Body() body: { toEmail: string }, @QueryRunner() qr: QR) {
        /**TODO 디음에 pincode가 아닌 link로 로직을 바꾸자 */
        const { toEmail } = body;
        const isExist = await this.userUseCase.hasExistedEmail(toEmail);

        let res = new AuthApiResponseDto();

        if (!isExist) {
            throw new NotFoundException('존재하지 않는 유저 입니다');
        }

        const result = await this.authUseCase.sendPasswordResetLink(toEmail, qr);

        res.sendPasswordResetLink = typeof result.response === 'string' ? result.response : '';

        return res;
    }
}
