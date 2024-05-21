import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { AuthException } from 'src/common/exception/auth-exception';
import { UsersService } from 'src/users/users.service';

import { UserModel } from '../entities/user.entity';
import { TempUserModel } from '../entities/temp-user.entity';
import { UserUseCase } from './user.use-case';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TempUserUseCase {
    constructor(private readonly userService: UsersService) {}

    /**내부에 Exception logic이 없습니다. 반환 받는 값을 확인하는 로직을 추가하세요
     *
     * 이유: DB에 query문 에러가 나오기에 password값이 노출되기에 외부에서 Exception하는 것을 강조
     */
    async createNewTempUser(email: string, qr: QueryRunner) {
        /**`email이 TemporaryUse table에 존재한다면 id 값을 .createTempUser()에 집어 둔다  */
        // const tempUser = await this.userService.getTempUserByEmail(email);

        const pinCode = await this._generatePinCode();

        return await this.userService.createTempUser({ email, pinCode }, qr);
    }
    async comparePINCodes(userInfo: Pick<TempUserModel, 'email' | 'pinCode'>) {
        const tempUser = await this.userService.getTempUserByEmail(userInfo.email);
        if (!tempUser) throw new NotFoundException('no tempUser in the DB that matches email');

        if (userInfo.pinCode === tempUser.pinCode) return true;

        return false;
    }
    async _generatePinCode(): Promise<string> {
        /**  6자리 PinCode 생성*/
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // async sendVerificationCode(user: User): Promise<void> {
    //     const verificationCode = await this.generatePinCode();

    //     user.verificationCode = verificationCode;

    //     await this.userRepository.save(user);

    //     return await this.emailService.sendVerificationToEmail(
    //       user.email,
    //       verificationCode,
    //     );
    // }
}
