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

    /** 토큰 검증
     *
     * 유요한 token이면 email을 포함한 유저 정보(보안이 필요없는 정보)를 기입한 토큰 반환
     *  아니라면, `JWT_INVALID_TOKEN` Exception 실행*/
    verifyToken(token: string): object {
        let isExpired: Boolean = false;
        try {
            isExpired = this.isTokenExpired(token);

            return this.jwtService.verify(token, {
                secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            });
        } catch (e) {
            // 만료되 토큰일 경우
            if (isExpired) {
                throw new AuthException('JWT_EXPIRED');
            }
            // 토큰이 서버에서 발급한 것이 아닌 경우
            throw new AuthException('JWT_INVALID_TOKEN');
        }
    }

    isTokenExpired(token: string): boolean {
        const decodedToken = this.jwtService.decode(token);
        const exp = decodedToken.exp;
        const now = Math.floor(Date.now() / 1000);
        return exp < now;
    }
    /**
     * refresh 토큰을 매게변수로 받아서 새로운 토큰을 반환
     *
     * refresh token에 문제가 없다면 newToken 반환 아니라면,
     * `REFRESH_TOKEN_TYPE_MISMATCH` Exception 실행
     */
    rotateToken(token: string, isRefreshToken: boolean): string {
        const decoded = this.jwtService.verify(token, {
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            complete: true,
        });
        console.log(decoded);

        /**
         * sub: id
         * email: email,
         * type: 'access' | 'refresh'
         */
        if (decoded.payload.type !== 'refresh') {
            throw new AuthException('REFRESH_TOKEN_TYPE_MISMATCH');
        }
        const newToken: string = this.signToken(
            {
                ...decoded.payload,
            },
            isRefreshToken,
        );

        return newToken;
    }

    // TODO: 1.salt를 잘 사용하고 주기적으로 salt를 바꿔주자
    // 2. bcript를 사용하자 단 너무 느게리게 사용하지 말고
    /** email& password를 받아서 DB에 저장된 유저와 일치하는지 비교
     *
     * 일치하면 true를 반환 아니라면 `INCORRECT_PASSWORD` Exception 실행
     */
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

    /** 매계변수로 받은 user정보와 isRefreshToken 값을 기입한 토큰을 발급합니다.*/
    signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean): string {
        const payload = {
            email: user.email,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        const newToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            // seconds
            expiresIn: isRefreshToken ? 36000 : 3600, // 토큰 타입에 따라 기간을 다르게 설정
        });

        return newToken;
    }

    async inCodingPassword(user: Pick<UserModel, 'password'>): Promise<string> {
        return await bcrypt.hash(
            `${user.password}${this.configService.get<string>(ENV_AUTH_SALT2024_KEY)}`,
            parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
        );
    }
}
