import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { BoardService } from '../boards.service';
import { BoardModel } from '../entities/board.entity';
import { Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class BoardUseCase {
    constructor(private readonly boardService: BoardService) {}

    async create(
        authorId: number,
        boardInfo: Pick<BoardModel, 'name' | 'accessLevel'>,
        qr: QueryRunner,
    ) {
        try {
            Logger.log('[usecase] Begin', { message: boardInfo });
            const createdBoard = await this.boardService.create(authorId, boardInfo, qr);
            Logger.log('[usecase] create board', { message: createdBoard });
            const newBoard = await this.boardService.save(createdBoard, qr);
            return newBoard;
        } catch (error) {
            throw new NotFoundException('board create 에러');
        }
    }

    getAll() {
        return this.boardService.findAll();
    }

    getDeletedAll() {
        return this.boardService.findDeletedAll();
    }

    getOneById(id: number) {
        return this.boardService.findOne(id);
    }

    async softDeleteBoard(id: number, qr: QueryRunner) {
        return await this.boardService.softDeleteBoard(id, qr);
    }

    async restoreBoard(id: number) {
        return await this.boardService.restore(id);
    }

    async addPost(boardId: number, postId: number, qr: QueryRunner) {
        const targetBoard = await this.boardService.findOne(boardId);
        if (!targetBoard) {
            Logger.log('targetBoard is null', { message: targetBoard });
            throw new NotFoundException();
        }
        if (!targetBoard.postIdHashMap) {
            targetBoard.postIdHashMap = {};
        }

        targetBoard.postIdHashMap[postId] = postId;
        return await this.boardService.save(targetBoard, qr);
    }

    async deletePost(boardId: number, postId: number, qr: QueryRunner) {
        const targetBoard = await this.boardService.findOne(boardId);
        if (!targetBoard) {
            Logger.log(`targetBoard${boardId} is null`, { message: targetBoard });
            throw new NotFoundException();
        }
        if (!(postId in targetBoard.postIdHashMap)) {
            Logger.log(`post:${postId} is null`, { message: targetBoard });
            throw new NotFoundException();
        }
        delete targetBoard.postIdHashMap[postId];
        return await this.boardService.save(targetBoard, qr);
    }
}
