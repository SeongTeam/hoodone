import { PostModel } from '../entities/post.entity';

export const postCreateOption: Pick<PostModel, 'favoriteCount' | 'commentCount' | 'isPublished'> = {
    favoriteCount: 0,
    commentCount: 0,
    isPublished: true,
};
