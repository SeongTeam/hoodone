import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleType } from 'src/users/const/role.type';
import { UserModel } from 'src/users/entities/user.entity';
import { CommentUseCase } from '../usecase/comment.use-case';

/** post의 작성자 인지 확인합니다. 만약 ADMIN이라면 true를 반환 */
@Injectable()
export class CommentOwnerGuard implements CanActivate {
    constructor(private readonly commentUseCase: CommentUseCase) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // // 1. 타입 안전성 강화 => 컴파일러에게 user 변수가 Request & {user: UsersModel} 타입임을 알려줌
        // // 2. 타입 오류 검출 => req.user가 존재하지 않거나 UsersModel 타입이 아닌 경우, TypeScript 컴파일러에서 오류를 발생
        const req = context.switchToHttp().getRequest() as Request & {
            user: UserModel;
        };
        const { user } = req;

        /**ADMIN일 경우 그냥 패스*/
        if (user.roles.includes(RoleType.ADMIN)) {
            return true;
        }

        if (!user) {
            throw new UnauthorizedException('CommentOwnerGuard) 사용자 정보를 가져올 수 없습니다.');
        }

        const id = req.params.id;

        if (!id) {
            throw new BadRequestException(
                'CommentOwnerGuard) Post ID가 파라미터로 제공 돼야합니다.',
            );
        }

        const isOk = await this.commentUseCase.isCommentOwner(user.id, parseInt(id));

        if (!isOk) {
            throw new ForbiddenException('CommentOwnerGuard) 권한이 없습니다.');
        }

        return true;
    }
}
