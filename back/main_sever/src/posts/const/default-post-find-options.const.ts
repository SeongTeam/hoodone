import { FindManyOptions } from 'typeorm';
import { PostModel } from '../entities/post.entity';

// where 옵션은 함수안에서 사용
export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostModel> = {
  relations: {
    author: true,
    comments: true,
  },
  select: {
    deletedAt: false,
    author: {
      id: true,
      nickname: true,
    },
  },

  withDeleted: false,
};
