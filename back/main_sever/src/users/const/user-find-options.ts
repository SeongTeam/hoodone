import { FindManyOptions } from 'typeorm';
import { UserModel } from '../entities/user.entity';

export const COMMON_FIND_USER_OPTIONS: FindManyOptions<UserModel> = {
    relations: {
        comments: true,
        questPosts: true,
        sbPosts: true,
    },
};
