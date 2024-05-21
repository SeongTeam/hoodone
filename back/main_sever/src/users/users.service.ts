import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException } from 'src/common/exception/auth-exception';

import { UserModel } from './entities/user.entity';
import { COMMON_FIND_USER_OPTIONS } from './const/user-find-options';
import { DEFAULT_CREATE_USER_OPTION } from './const/default-user-create-option';
import { TempUserModel } from './entities/temp-user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserModel)
        private readonly usersRepository: Repository<UserModel>,
        @InjectRepository(TempUserModel)
        private readonly tempUserRepository: Repository<TempUserModel>,
    ) {}

    async hasExistedNickname(nickname: string): Promise<boolean> {
        return await this.usersRepository.exists({
            where: {
                nickname,
            },
        });
    }
    async hasExistedEmail(email: string) {
        return await this.usersRepository.exists({
            where: {
                email,
            },
        });
    }
    async createTempUser(userDtoData: Pick<TempUserModel, 'email' | 'pinCode'>, qr?: QueryRunner) {
        /**DB에 이미 존재하는 tempUser라면 update 아니면 새로 생성 */

        const user: TempUserModel = await this.getTempUserByEmail(userDtoData.email);
        const repository = this._getTempUsersRepository(qr);
        let tempUser: TempUserModel;

        try {
            if (user) {
                tempUser = await repository.create({
                    ...userDtoData,
                    isVerfied: false,
                    id: user.id,
                });
            } else {
                tempUser = await repository.create({
                    ...userDtoData,
                    isVerfied: false,
                });
            }
        } catch (e) {
            throw new AuthException('ACCOUNT_CREATION_FAILED', {
                describe:
                    'UserService.createTempUser()에서 error / user.service.ts createdTempUse() FAIL',
            });
        }
        return await repository.save(tempUser);
    }

    async createUser(
        userDtoData: Pick<UserModel, 'email' | 'nickname' | 'password'>,
        qr?: QueryRunner,
    ) {
        const { email, nickname, password } = userDtoData;
        const userRepository = this._getUsersRepository(qr);
        let user: UserModel;

        try {
            user = userRepository.create({
                nickname: nickname,
                email,
                password,
                ...DEFAULT_CREATE_USER_OPTION,
            });
        } catch (e) {
            throw new AuthException('ACCOUNT_CREATION_FAILED', {
                describe: 'UserService.createUser()에서 error',
            });
        }
        return await userRepository.save(user);
    }

    async getAllUsers() {
        return this.usersRepository.find({
            ...COMMON_FIND_USER_OPTIONS,
        });
    }

    async getUserByEmail(email: string) {
        const existingUser = await this.usersRepository.findOne({
            where: {
                email,
            },
        });
        return existingUser;
    }

    async getUserByNickname(nickname: string) {
        const existingUser = await this.usersRepository.findOne({
            where: {
                nickname,
            },
        });
        return existingUser;
    }

    async getTempUserByEmail(email: string) {
        const existingUser = await this.tempUserRepository.findOne({
            where: {
                email,
            },
        });
        return existingUser;
    }
    _getUsersRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UserModel>(UserModel) : this.usersRepository;
    }
    _getTempUsersRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<TempUserModel>(TempUserModel)
            : this.tempUserRepository;
    }
}
