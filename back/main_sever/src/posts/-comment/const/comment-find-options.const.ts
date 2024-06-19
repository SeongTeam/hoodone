import { FindManyOptions } from 'typeorm';
import { CommentModel } from '../entities/comment.entity';

export const COMMON_COMMENT_FIND_OPTION: FindManyOptions<CommentModel> = {
    relations: {
        author: true,
        questPost: true,
        sbtPost: true,
    },
    select: {
        deletedAt: false,
        updatedAt: false,
        author: {
            id: true,
            nickname: true,
        },
        questPost: {
            positiveCount: true,
            negativeCount: true,
            title: true,
        },
        sbtPost: {
            positiveCount: true,
            negativeCount: true,
            title: true,
        },
    },
};
