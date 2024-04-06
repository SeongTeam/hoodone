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

  /** 회워가입하려는 닉네임이 존재하는지 확인
   * ture면*/
  async isNicknameAvailable(nickName: string): Promise<boolean> {
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickName,
      },
    });

    if (nicknameExists) {
      throw new AuthException('NICKNAME_EXISTS');
    }
    return true;
  }
  async isEmailAvailable(email: string) {
    const emailExists = await this.usersRepository.exists({
      where: {
        email,
      },
    });

    if (emailExists) {
      throw new AuthException('EMAIL_EXISTS');
    }
    return true;
  }

  async createUser(user: Pick<UserModel, 'email' | 'nickName' | 'password'>, qr: QueryRunner) {
    const { email, nickName, password } = user;
    const userRepository = this._getUsersRepository(qr);

    try {
      const userObject = userRepository.create({
        nickName: nickName,
        email,
        password,
        ...DEFAULT_CREATE_UserModel_OPTIONS,
      });

      return await userRepository.save(userObject);
    } catch (e) {
      throw new AuthException('ACCOUNT_CREATION_FAILED');
    }
  }

  async getAllUsers() {
    return this.usersRepository.find({
      ...DEFAULT_FIND_UserModel_OPTIONS,
    });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
  _getUsersRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<UserModel>(UserModel) : this.usersRepository;
  }
}
