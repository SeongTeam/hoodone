import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthException } from 'src/common/exception/auth-exception';

import { UserModel } from './entities/user.entity';
import {
  DEFAULT_CREATE_UserModel_OPTIONS,
  DEFAULT_FIND_UserModel_OPTIONS,
} from './const/default_qurey_user_options';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async isNicknameAvailable(nickname: string): Promise<boolean> {
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname,
      },
    });

    return nicknameExists;
  }
  async isEmailAvailable(email: string) {
    const emailExists = await this.usersRepository.exists({
      where: {
        email,
      },
    });

    return emailExists;
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
        ...DEFAULT_CREATE_UserModel_OPTIONS,
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
      ...DEFAULT_FIND_UserModel_OPTIONS,
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
