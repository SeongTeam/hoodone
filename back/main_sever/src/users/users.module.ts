import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { UserUseCase } from './usecase/user.use-case';
import { TempUserModel } from './entities/temp-user.entity';
import { TempUserUseCase } from './usecase/temp-user.case';
import { TicketUseCase } from 'src/users/_tickets/usecase/ticket_use_case';
import { TicketModule } from 'src/users/_tickets/ticket.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TempUserModel, UserModel]),
        forwardRef(() => TicketModule),
        forwardRef(() => AuthModule),
    ],
    exports: [UserUseCase, TempUserUseCase],
    controllers: [UsersController],
    providers: [TempUserUseCase, UserUseCase, UsersService],
})
export class UsersModule {}
