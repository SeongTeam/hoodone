import { FindManyOptions } from 'typeorm';
import { QuestPostModel } from '../entities/quest_post.entity';
import { SbPostModel } from '../entities/sb_post.entity';

// where 옵션은 함수안에서 사용
export const QUEST_POST_FIND_OPTION: FindManyOptions<QuestPostModel> = {
    relations: {
        author: true,
        comments: true,
        sbPosts: true,
        favoriteUsers: true,
    },
    select: {
        deletedAt: false,
        author: {
            nickname: true,
            profileImagePublicId: true,
        },
    },

    withDeleted: false,
};

export const SB_POST_FIND_OPTION: FindManyOptions<SbPostModel> = {
    relations: {
        author: true,
        comments: true,
        parentPost: {
            author: true,
        },
        favoriteUsers: true,
    },
    select: {
        deletedAt: false,
        author: {
            nickname: true,
            profileImagePublicId: true,
        },
    },

    withDeleted: false,
};
