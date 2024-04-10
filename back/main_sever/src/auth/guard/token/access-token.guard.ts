import { Injectable } from '@nestjs/common/decorators';
import { BearerTokenGuard } from './bearer-token.guard';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.isRoutePublic) {
            return true;
        }

        if (req.tokenType !== 'access') {
            throw new UnauthorizedException('Access Token이 아닙니다.');
        }

        return true;
    }
}
