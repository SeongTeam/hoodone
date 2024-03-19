import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserModel } from './entities/user.entity'
import { AuthCredentialsDto, RegisterUserDto } from 'src/auth/dto/auth-credential.dto'

@Injectable()
export class UserRepository extends Repository<UserModel> {
  constructor(dataSource: DataSource) {
    super(UserModel, dataSource.createEntityManager())
  }

  async createUser(authCredentialsDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password } = authCredentialsDto

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.create({ nickname: nickname, email: email, password: hashedPassword })

    try {
      await this.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
  async findUserWithUserName(username: string): Promise<UserModel> {
    const foundUser = this.findOneBy({ nickname: username })
    return foundUser
  }
}
