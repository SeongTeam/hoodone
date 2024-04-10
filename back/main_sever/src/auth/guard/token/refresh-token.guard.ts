import { Injectable } from '@nestjs/common/decorators';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { UnauthorizedException } from '@nestjs/common/exceptions';

import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.isRoutePublic) {
            return true;
        }

        if (req.tokenType !== 'refresh') {
            throw new UnauthorizedException('Refresh Token이 아닙니다.');
        }

        return true;
    }
}
