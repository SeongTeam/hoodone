import { DeepPartial } from 'typeorm/common/DeepPartial';
import { UserModel, UserModelStatus } from '../entities/user.entity';
import { FindManyOptions } from 'typeorm';

/**
 * DB에 UserModel을 생성할떄 사용되는 default값을 정의해두었다
 */
export const DEFAULT_CREATE_UserModel_OPTIONS: DeepPartial<UserModel> = {
  status: UserModelStatus.ACTIVE,
  suspensionEnd: null,
  userReportCount: 0,
  userReportedCount: 0,
};

export const DEFAULT_FIND_UserModel_OPTIONS: FindManyOptions<UserModel> = {
  relations: {
    comments: true,
    posts: true,
  },
};
