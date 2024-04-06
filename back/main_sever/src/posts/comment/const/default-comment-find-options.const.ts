import { FindManyOptions } from 'typeorm';
import { CommentModel } from '../entities/comment.entity';

export const DEFAULT_COMMENT_FIND_OPTIONS: FindManyOptions<CommentModel> = {
  relations: {
    author: true,
    post: true,
  },
  select: {
    deletedAt: false,
    updatedAt: false,
    author: {
      id: true,
      nickName: true,
    },
    post: {
      likeCount: true,
      title: true,
    },
  },
};
