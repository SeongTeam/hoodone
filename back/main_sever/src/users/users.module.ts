import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { UserUseCase } from './usecase/user.use-case';
import { TempUserModel } from './entities/temp-user.entity';
import { TempUserUseCase } from './usecase/temp-user.case';

@Module({
    imports: [TypeOrmModule.forFeature([TempUserModel, UserModel])],
    exports: [UserUseCase],
    controllers: [UsersController],
    providers: [TempUserUseCase, UserUseCase, UsersService],
})
export class UsersModule {}
