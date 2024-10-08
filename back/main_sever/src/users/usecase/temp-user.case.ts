import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { AuthException } from 'src/_common/exception/auth-exception';
import { UsersService } from 'src/users/users.service';

import { TempUserModel } from '../entities/temp-user.entity';
import { UserUseCase } from './user.use-case';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class TempUserUseCase {
    constructor(
        private readonly userService: UsersService,
        private readonly userUseCase: UserUseCase,
    ) {}

    /**DB에 이미 존재하는 tempUser라면 update 아니면 새로 생성,  pinCode는 DB에 tempUser를 만든 후 재생성 가능
     *  1) update시에는 QueryRunner사용 필수 아님, 새로 생성시에는 QueryRunner 사용 요망
     */
    async upsertTempUser(email: string, pinCode: string, qr?: QueryRunner) {
        // const pinCode = await this.generatePinCode();
        const isExist = await this.userUseCase.hasExistedEmail(email);
        if (isExist) {
            throw new AuthException('EMAIL_EXISTS');
        }

        return await this.userService.upsertTempUser({ email, pinCode }, qr);
    }
    async comparePinCodes(userInfo: Pick<TempUserModel, 'email' | 'pinCode'>) {
        const tempUser = await this.userService.getTempUserByEmail(userInfo.email);

        const now = new Date();
        const updatedAt = new Date(tempUser.updatedAt);
        const diff = now.getTime() - updatedAt.getTime();

        if (!tempUser) throw new NotFoundException('no tempUser in the DB that matches email');

        if (diff < 180000 && userInfo.pinCode === tempUser.pinCode) return true;
        // if (userInfo.pinCode === tempUser.pinCode) return true;

        return false;
    }
    async generatePinCode(): Promise<string> {
        /**  6자리 PinCode 생성*/
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
