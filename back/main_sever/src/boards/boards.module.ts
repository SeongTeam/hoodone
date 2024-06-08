import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModel } from './entities/board.entity';
import { BoardUseCase } from './usecase/board.use-case';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
@Module({
    imports: [TypeOrmModule.forFeature([BoardModel]), AuthModule, UsersModule, CommonModule],
    controllers: [BoardController],

    providers: [BoardService, BoardUseCase],
    exports: [BoardUseCase],
})
export class BoardModule {
    constructor() {}
}
