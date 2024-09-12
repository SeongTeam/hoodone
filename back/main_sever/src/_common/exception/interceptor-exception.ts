import { HttpStatus } from '@nestjs/common/enums';
import { BaseException } from './common/base.exception';
import { InterceptorExceptionCodeEnum } from './common/enum/interceptor-exception';
import { InterceptorExceptionMsg } from './common/const/message/exception.message';
import { HttpExceptionOptions } from '@nestjs/common';
import { HttpStatusType } from './common/base.exception';

/*TODO
    - 수정 InterceptorException -> TransactionException. 
*/
export class InterceptorException extends BaseException {
    constructor(statusEnum: HttpStatusType, options?: HttpExceptionOptions) {
        const status = HttpStatus[statusEnum];
        const response = `Error-100)${InterceptorExceptionMsg.error100}`;
        super(InterceptorExceptionCodeEnum.transaction, status, response, options);
    }
}
