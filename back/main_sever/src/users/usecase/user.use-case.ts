import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { AuthException } from 'src/common/exception/auth-exception';
import { UsersService } from 'src/users/users.service';

import { UserModel } from '../entities/user.entity';

@Injectable()
export class UserUseCase {
    constructor(private readonly userService: UsersService) {}

    /**내부에 Exception logic이 없습니다. 반환 받는 값을 확인하는 로직을 추가하세요
     *
     * 이유: DB에 query문 에러가 나오기에 password값이 노출되기에 외부에서 Exception하는 것을 강조
     */
    async createNewUser(
        userInfo: Pick<UserModel, 'email' | 'nickname' | 'password'>,
        qr: QueryRunner,
    ): Promise<UserModel | null> {
        const isEmailExisted: boolean = await this.hasExistedEmail(userInfo.email);
        const isNicknameExisted: boolean = await this.hasExistedNickname(userInfo.nickname);

        if (!(isEmailExisted || isNicknameExisted)) {
            return this.userService.createUser(userInfo, qr);
        }
        return null;
    }

    /** true면 존재하는 이메일, false면 존재하지 않는 이메일 */
    hasExistedEmail(email: string): Promise<boolean> {
        return this.userService.hasExistedEmail(email);
    }
    /**true면 존재하는 닉네임, false면 존재하지 않는 닉네임 */
    async hasExistedNickname(nickname: string): Promise<boolean> {
        return await this.userService.hasExistedNickname(nickname);
    }

    async getAllUsers(): Promise<UserModel[]> {
        const existingUser = await this.userService.getAllUsers();
        if (!existingUser) {
            throw new AuthException('EMAIL_NOT_FOUND');
        }
        return existingUser;
    }
    /** User가 존재하면 반환, User가 null이면  */
    async getUserByNickname(nickname: string): Promise<UserModel> {
        const existingUser = await this.userService.getUserByNickname(nickname);
        if (!existingUser) {
            throw new AuthException('EMAIL_NOT_FOUND');
        }
        return existingUser;
    }

    async getUserByEmail(email: string): Promise<UserModel> {
        const existingUser = await this.userService.getUserByEmail(email);
        if (!existingUser) {
            throw new AuthException('EMAIL_NOT_FOUND');
        }
        return existingUser;
    }
}
