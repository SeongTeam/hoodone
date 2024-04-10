import { FindManyOptions } from 'typeorm';
import { CommentModel } from '../entities/comment.entity';

export const COMMON_COMMENT_FIND_OPTION: FindManyOptions<CommentModel> = {
    relations: {
        author: true,
        post: true,
    },
    select: {
        deletedAt: false,
        updatedAt: false,
        author: {
            id: true,
            nickname: true,
        },
        post: {
            likeCount: true,
            title: true,
        },
    },
};
