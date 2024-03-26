import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel, UserModelStatus } from './entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
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

  getUsersRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<UserModel>(UserModel) : this.usersRepository;
  }

  async createUser(user: Pick<UserModel, 'email' | 'nickname' | 'password'>) {
    // 1) nickname 중복이 없는지 확인
    // exist() -> 만약에 조건에 해당되는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 nickname 입니다!');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 가입한 이메일입니다!');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      ...DEFAULT_CREATE_UserModel_OPTIONS,
    });
    const newUser = await this.usersRepository.save(userObject);
    return newUser;
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
}
