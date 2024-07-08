import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/_common/common.module';
import { UsersModule } from 'src/users/users.module';
import { TicketUseCase } from './usecase/ticket_use_case';
import { TicketModel } from './entities/ticket.entity';
import { TicketService } from './ticket.service';

export const COMMENT_USE_CASES = Symbol('COMMENT_USE_CASES');

@Module({
    imports: [TypeOrmModule.forFeature([TicketModel])],
    controllers: [],
    exports: [TicketUseCase],
    providers: [TicketUseCase, TicketService],
})
export class TicketModule {}
