import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindManyOptions, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException } from 'src/_common/exception/auth-exception';

import { UserModel } from './entities/user.entity';
import { COMMON_FIND_USER_OPTIONS } from './const/user-find-options';
import { DEFAULT_CREATE_USER_OPTION } from './const/default-user-create-option';
import { TempUserModel } from './entities/temp-user.entity';
import { TicketModel } from 'src/users/_tickets/entities/ticket.entity';
import { ENV_ADMIN_EMAIL } from '@/_common/const/env-keys.const';

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
    /**DB에 이미 존재하는 tempUser라면 update 아니면 새로 생성
     * update시에는 QueryRunner사용 필수 아님
     */
    async upsertTempUser(userDtoData: Pick<TempUserModel, 'email' | 'pinCode'>, qr?: QueryRunner) {
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
                    updatedAt: new Date(),
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
        ticket: TicketModel,
        qr?: QueryRunner,
    ) {
        const { email, nickname, password } = userDtoData;
        const userRepository = this._getUsersRepository(qr);
        let user: UserModel;

        try {
            user = userRepository.create({
                nickname,
                email,
                password,
                ticket,

                ...DEFAULT_CREATE_USER_OPTION,
            });

            return await userRepository.save(user);
        } catch (e) {
            Logger.error(`[UsersService][createUser] error`, JSON.stringify(e));
            throw new AuthException('ACCOUNT_CREATION_FAILED', {
                describe: 'UserService.createUser()에서 error',
            });
        }
    }

    async updateUser(
        userId: number,
        userDtoData: Pick<UserModel, 'password' | 'nickname' | 'verificationToken'>,
        qr?: QueryRunner,
    ): Promise<UpdateResult> {
        const { nickname, verificationToken } = userDtoData;

        try {
            const userRepository = this._getUsersRepository(qr);
            const now: Date = new Date();

            const result: UpdateResult = await userRepository.update(
                { id: userId },
                { ...userDtoData, updatedAt: now },
            );

            return result;
        } catch (e) {
            throw new NotFoundException(e);
        }
    }
    resetPassword(userInfo: Pick<UserModel, 'id' | 'password'>, qr: QueryRunner) {
        const { password, id } = userInfo;

        const userRepository = this._getUsersRepository(qr);
        const now: string = new Date().toLocaleString('kr');

        return userRepository.update({ id: id }, { password, updatedAt: now });
    }

    async getAllUsers() {
        return this.usersRepository.find({
            ...COMMON_FIND_USER_OPTIONS,
        });
    }

    async getUser(
        where: Pick<UserModel, 'id' | 'nickname' | 'email'>,
        option?: FindManyOptions<UserModel>,
    ) {
        const findOption = option ?? COMMON_FIND_USER_OPTIONS;
        const existingUser = await this.usersRepository.findOne({
            where: where,
            ...COMMON_FIND_USER_OPTIONS,
        });
        return existingUser;
    }

    async getUserUsingAccessToken(email: string, option?: FindManyOptions<UserModel>) {
        const existingUser = await this.usersRepository.findOne({
            where: {
                email,
            },
            ...option,
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

    isAdmin(user: UserModel) {
        return user.email === process.env[ENV_ADMIN_EMAIL];
    }
}
