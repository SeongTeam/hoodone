import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { UserUseCase } from './usecase/user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  exports: [UserUseCase],
  controllers: [UsersController],
  providers: [UserUseCase, UsersService],
})
export class UsersModule {}
