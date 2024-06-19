import { PostModel } from '../entities/post.entity';

export const postCreateOption: Pick<
    PostModel,
    'positiveCount' | 'negativeCount' | 'commentCount' | 'isPublished'
> = { positiveCount: 0, negativeCount: 0, commentCount: 0, isPublished: true };
