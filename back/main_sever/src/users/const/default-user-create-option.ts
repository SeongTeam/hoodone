import { DeepPartial } from 'typeorm/common/DeepPartial';
import { UserModel, UserModelStatus } from '../entities/user.entity';

/**
 * DB에 UserModel을 생성할떄 사용되는 default값을 정의해두었다
 */
export const DEFAULT_CREATE_USER_OPTION: DeepPartial<UserModel> = {
    status: UserModelStatus.ACTIVE,
    suspensionEnd: null,
    userReportCount: 0,
    userReportedCount: 0,
};
