import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { UserModel } from 'src/users/entities/user.entity';

/** Role 데코리터와 함께 사용해야합니다. */
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        /** Role 데코레이터 사용하지 않으면 true를 리턴  */
        if (!roles) {
            return true;
        }

        const req = context.switchToHttp().getRequest() as Request & {
            user: UserModel;
        };
        const { user } = req;
        const userRoles = user.roles;

        if (!user) {
            throw new UnauthorizedException('RoleGuard) 사용자 정보를 가져올 수 없습니다');
        }
        if (!userRoles) {
            throw new UnauthorizedException('RoleGuard) user.roles 정보를 가져올 수 없습니다');
        }

        if (!userRoles.some((role) => roles.includes(role))) {
            throw new ForbiddenException('RoleGuard) Role 권한 없습니다.');
        }
        return true;
    }
}
