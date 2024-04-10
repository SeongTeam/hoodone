import { HttpStatus } from '@nestjs/common/enums';
import { BaseException } from './common/base.exception';
import { InterceptorExceptionCodeEnum } from './common/enum/interceptor-exception';
import { InterceptorExceptionMsg } from './common/const/message/exception.message';

export class InterceptorException extends BaseException {
    constructor(detailInfo?: { message?: string; pastMsg?: any }) {
        super(
            InterceptorExceptionCodeEnum.transaction,
            HttpStatus.NOT_ACCEPTABLE,
            `Error-100)${InterceptorExceptionMsg.error100}`,
            detailInfo,
        );
    }
}
