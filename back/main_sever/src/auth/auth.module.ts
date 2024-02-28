import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserRepository } from 'src/users/user.repository'
import { User } from 'src/users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  // 인스턴스화 없이 IOC container에서 class를 사용가능
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
