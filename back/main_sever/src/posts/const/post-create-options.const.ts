import { PostModel } from '../entities/post.entity';
import { SbPostModel, VoteResult } from '../entities/sb_post.entity';

export const postCreateOption: Pick<
    SbPostModel,
    'favoriteCount' | 'commentCount' | 'isPublished' | 'voteResult'
> = {
    favoriteCount: 0,
    commentCount: 0,
    isPublished: true,
    voteResult: VoteResult.NOT_YET,
};
