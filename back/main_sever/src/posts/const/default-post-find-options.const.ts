import { FindManyOptions } from 'typeorm';
import { PostsModel } from '../entities/posts.entity';

// where 옵션은 함수안에서 사용
export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  relations: {
    author: true,
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
