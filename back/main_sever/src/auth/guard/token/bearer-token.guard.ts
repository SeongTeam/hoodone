import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserUseCase } from 'src/users/usecase/user.use-case';

import { AuthUseCase } from '../../usecase/auth.use-case';

/**AccessTokenGuard & refreshTokenGuard의 부모 class 직접적으로 사용되지 않습니다*/
@Injectable()
export class BearerTokenGuard implements CanActivate {
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

        const token = this.authUseCase.extractTokenFromHeader(rawToken, true);

        const result = await this.authUseCase.verifyToken(token);

        /**
         * request에 넣을 정보
         *
         * 1) 사용자 정보 - user
         * 2) token - token
         * 3) tokenType - access | refresh
         */
        const user = await this.userUseCase.getUserByEmail(result.email);

        req.user = user;
        req.token = token;
        req.tokenType = result.type;

        return true;
    }
}

// @Injectable()
// export class AccessTokenGuard extends BearerTokenGuard {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     await super.canActivate(context);

//     const req = context.switchToHttp().getRequest();

//     if (req.isRoutePublic) {
//       return true;
//     }

//     if (req.tokenType !== 'access') {
//       throw new UnauthorizedException('Access Token이 아닙니다.');
//     }

//     return true;
//   }
// }

// @Injectable()
// export class RefreshTokenGuard extends BearerTokenGuard {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     await super.canActivate(context);

//     const req = context.switchToHttp().getRequest();

//     if (req.isRoutePublic) {
//       return true;
//     }

//     if (req.tokenType !== 'refresh') {
//       throw new UnauthorizedException('Refresh Token이 아닙니다.');
//     }

//     return true;
//   }
// }
