import { Injectable } from '@nestjs/common/decorators';
import { UsersService } from 'src/users/users.service';
import { UserModel } from '../entities/user.entity';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

@Injectable()
export class UserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async createNewUser(user: Pick<UserModel, 'email' | 'nickName' | 'password'>, qr: QueryRunner) {
    const isEmailAvailable = await this.usersService.isEmailAvailable(user.email);
    const isNickNameAvailable = await this.usersService.isNicknameAvailable(user.nickName);

    if (isEmailAvailable && isNickNameAvailable) {
      return this.usersService.createUser(user, qr);
    }
  }

  async getUserByEmail(email: string) {
    return await this.usersService.getUserByEmail(email);
  }
}
