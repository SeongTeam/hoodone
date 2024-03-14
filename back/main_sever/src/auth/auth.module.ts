import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    UsersModule,
    // JwtModule.register({})를 주석 처리했기에 뜨는 에러입니다
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  // 인스턴스화 없이 IOC container에서 class를 사용가능
  providers: [AuthService],
})
export class AuthModule {}
