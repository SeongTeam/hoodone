import { FindManyOptions } from 'typeorm';
import { CommentModel } from '../entities/comment.entity';

export const COMMON_COMMENT_FIND_OPTION: FindManyOptions<CommentModel> = {
    relations: {
        author: true,
        questPost: true,
        sbPost: true,
    },
    select: {
        deletedAt: false,
        updatedAt: false,
        author: {
            id: true,
            nickname: true,
        },
        questPost: {
            favoriteCount: true,
            title: true,
        },
        sbPost: {
            favoriteCount: true,
            title: true,
        },
    },
};
