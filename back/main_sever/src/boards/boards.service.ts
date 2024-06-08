import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardModel } from './entities/board.entity';
import { QueryRunner, Repository, Not, IsNull } from 'typeorm';
import { COMMON_BOARD_FIND_OPTION } from './const/board-find-option.const';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardModel)
        private readonly boardsRepository: Repository<BoardModel>,
    ) {}

    async findAll(): Promise<BoardModel[]> {
        return this.boardsRepository.find({
            ...COMMON_BOARD_FIND_OPTION,
            withDeleted: false,
        });
    }

    async findDeletedAll(): Promise<BoardModel[]> {
        return this.boardsRepository.find({
            ...COMMON_BOARD_FIND_OPTION,
            withDeleted: true,
            where: {
                deletedAt: Not(IsNull()),
            },
        });
    }

    async softDeleteBoard(id: number, qr?: QueryRunner) {
        const _repository = this._getRepository(qr);

        const targetBoard = await _repository.findOne({
            where: {
                id,
            },
            withDeleted: false,
        });

        if (!targetBoard) {
            throw new NotFoundException();
        }

        if (!this.isBoardEmpty(targetBoard)) {
            Logger.log('board is not empty. post migration is required', { message: targetBoard });
            throw new Error('board is not empty. post migration is required');
        }
        return await _repository.softRemove(targetBoard);
    }

    async restore(id: number) {
        const deletedBoard = await this.boardsRepository.findOne({
            where: {
                id,
            },
            withDeleted: true,
        });
        if (!deletedBoard) {
            throw new NotFoundException();
        }

        deletedBoard.deletedAt = null;
        await this.boardsRepository.save(deletedBoard);
    }

    async create(
        authorId: number,
        boardInfo: Pick<BoardModel, 'name' | 'accessLevel'>,
        qr?: QueryRunner,
    ) {
        const _repository = this._getRepository(qr);

        Logger.log('[BoardService]', { message: boardInfo });
        const createdBoard = await _repository.create({
            author: {
                id: authorId,
            },
            ...boardInfo,
        });
        return createdBoard;
    }

    async save(board: BoardModel, qr?: QueryRunner) {
        const _repository = this._getRepository(qr);
        return _repository.save(board);
    }

    findOne(id: number) {
        Logger.log('[BoardService] findOne', { message: id });
        return this.boardsRepository.findOne({
            ...COMMON_BOARD_FIND_OPTION,
            where: {
                id,
            },
        });
    }

    async remove(id: number, qr?: QueryRunner) {
        const _repository = this._getRepository(qr);

        const targetBoard = await _repository.findOne({
            where: {
                id,
            },
            withDeleted: false,
        });

        if (!targetBoard) {
            throw new NotFoundException();
        }

        if (!this.isBoardEmpty(targetBoard)) {
            Logger.log('board is not empty. post migration is required', { message: targetBoard });
            throw new Error('board is not empty. post migration is required');
        }
        await _repository.remove(targetBoard);
    }
    _getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<BoardModel>(BoardModel) : this.boardsRepository;
    }

    isBoardEmpty(board: BoardModel) {
        const postCount = Object.keys(board.postIdHashMap).length;
        Logger.log('[isBoardEmpty]' + postCount, { message: board });
        return postCount === 0;
    }
}
