import { Inject, Injectable } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { QueryRunner } from 'typeorm';

import { AuthException } from 'src/common/exception/auth-exception';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { UserModel } from 'src/users/entities/user.entity';

import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credential.dto';

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

    /**Basic) al;sdkfjoiasdjlzkxcjvsdf인 base64 형태인 token을 decoding
     *
     *email & password를 반환 */
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

    /** refreshToken을 매계변수로 받아서 새로운 accessToken을 반환 */
    rotateAccessToken(refreshToken: string): string {
        return this.authService.rotateToken(refreshToken, false);
    }
    /** refreshToken을 매계변수로 받아서 새로운 refreshToken을 반환 */
    rotateRefreshToken(refreshToken: string): string {
        return this.authService.rotateToken(refreshToken, true);
    }

    /**토큰이 서버에서 발급한 것인지 검증*/
    verifyToken(token: string): string | any {
        return this.authService.verifyToken(token);
    }

    async loginWithEmail(
        loginInfo: Pick<UserModel, 'email' | 'password'>,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const existingUser = await this.userUseCase.getUserByEmail(loginInfo.email);

        if (existingUser) {
            const is = await this.authService.authenticateWithEmailAndPassword(
                loginInfo,
                existingUser,
            );

            return {
                accessToken: this.authService.signToken(existingUser, false),
                refreshToken: this.authService.signToken(existingUser, true),
            };
        }
    }

    /** 이메일로 회원가입 진행
     *
     * 회원가입을 완료하면 자동으로 로그인을 위해 token 발급  */
    async registerWithEmail(
        userInfo: Pick<UserModel, 'email' | 'nickname' | 'password'>,
        qr: QueryRunner,
    ): Promise<{ accessToken: string; refreshToken: string }> {
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
