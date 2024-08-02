import { FindManyOptions } from 'typeorm';
import { UserModel } from '../entities/user.entity';

export const EXTENDED_FIND_USER_OPTIONS: FindManyOptions<UserModel> = {
    relations: {
        comments: true,
        questPosts: true,
        sbPosts: true,
        favoriteQuests: true,
        favoriteSbs: true,
        ticket: true,
    },
};

export const TOKEN_GUARD_FIND_USER_OPTIONS: FindManyOptions<UserModel> = {
    relations: {
        favoriteQuests: true,
        favoriteSbs: true,
        ticket: true,
    },
};

export const BASIC_FIND_USER_OPTIONS: FindManyOptions<UserModel> = {
    relations: {
        favoriteQuests: true,
        favoriteSbs: true,
        ticket: true,
    },
};
