import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    Logger,
    BadRequestException,
    ParseIntPipe,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/_common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/_common/decorator/query-runner.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { QueryRunner as QR } from 'typeorm';
import { AccessLevel } from './entities/board.entity';
import { BoardUseCase } from './usecase/board.use-case';

@Controller('board')
export class BoardController {
    constructor(private readonly boardUseCase: BoardUseCase) {}

    /*TODO
    - Route 경로 정리하기
    */
    @Get('/all')
    findAll() {
        return this.boardUseCase.getAll();
    }

    @Get('find/deleted')
    findDeleted() {
        return this.boardUseCase.getDeletedAll();
    }

    @Get('/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.boardUseCase.getOneById(id);
    }

    @Post('/admin')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    create(
        @User('id') userId: number,
        @Body() createBoardDto: CreateBoardDto,
        @QueryRunner() qr: QR,
    ) {
        Logger.log('create board', { message: createBoardDto });
        const { name, accessLevel: strifiedAccessLevel } = createBoardDto;

        if (!this.isValidAccessLevel(strifiedAccessLevel)) {
            Logger.log('invalid access level', { message: strifiedAccessLevel });
            throw new BadRequestException('Invalid access level');
        }
        const accessLevel = AccessLevel[strifiedAccessLevel];
        Logger.log('accessLevel', { message: accessLevel });
        const boardInfo = { name, accessLevel };

        Logger.log('create board', { message: boardInfo });
        return this.boardUseCase.create(userId, boardInfo, qr);
    }

    //AccessLevel 혹은 다른 모듈에 내장하기
    private isValidAccessLevel(key: string): key is keyof typeof AccessLevel {
        return Object.keys(AccessLevel).includes(key);
    }

    @Delete('/admin/:id')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    delete(@Param('id', ParseIntPipe) id: number, @QueryRunner() qr: QR) {
        return this.boardUseCase.softDeleteBoard(id, qr);
    }
}
