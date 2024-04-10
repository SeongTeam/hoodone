import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException } from 'src/common/exception/auth-exception';

import { UserModel } from './entities/user.entity';
import { COMMON_FIND_USER_OPTIONS } from './const/user-find-options';
import { DEFAULT_CREATE_USER_OPTION } from './const/default-user-create-option';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserModel)
        private readonly usersRepository: Repository<UserModel>,
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
                message: 'UserService.createUser()에서 error',
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
    _getUsersRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<UserModel>(UserModel) : this.usersRepository;
    }
}
