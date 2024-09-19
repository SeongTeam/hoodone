import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthException } from 'src/_common/exception/auth-exception';
import { UserUseCase } from 'src/users/usecase/user.use-case';

import { AuthUseCase } from '../../usecase/auth.use-case';
/**
 * 로그인시에 사용되는 Guard, `req.headers['authorization']`의 토큰을
 * 디코하여서 유요한 사용자인지 확인, 만약 없는 사용자라면 Exception 실행
 */
@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(
        private readonly authUseCase: AuthUseCase,
        private readonly userUseCase: UserUseCase,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const rawToken = req.headers['authorization'];

        if (!rawToken) {
            throw new UnauthorizedException('토큰이 없습니다!');
        }

        const token = this.authUseCase.extractTokenFromHeader(rawToken, false);
        const { email, password } = this.authUseCase.decodeBasicToken(token);
        const isExists = await this.userUseCase.hasExistedEmail(email);

        if (isExists) return true;
        else throw new AuthException('EMAIL_NOT_FOUND');
    }
}
