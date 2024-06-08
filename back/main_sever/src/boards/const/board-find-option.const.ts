import { FindManyOptions } from 'typeorm';
import { BoardModel } from '../entities/board.entity';

// where 옵션은 함수안에서 사용
export const COMMON_BOARD_FIND_OPTION: FindManyOptions<BoardModel> = {
    relations: {
        author: true,
    },

    select: {
        author: {
            id: true,
            nickname: true,
        },
    },
};
