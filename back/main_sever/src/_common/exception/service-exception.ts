import {
    HttpExceptionOptions,
    HttpStatus,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { BaseException, HttpStatusType } from './common/base.exception';
import { ServiceExceptionEnum } from './common/enum/service-exception-code.enum';

type ServiceExceptionEnumType = keyof typeof ServiceExceptionEnum;

export class ServiceException extends BaseException {
    constructor(
        ExceptionEnum: ServiceExceptionEnumType,
        statusEnum: HttpStatusType,
        response?: Record<string, any> | string,
        options?: HttpExceptionOptions,
    ) {
        const code = ServiceExceptionEnum[ExceptionEnum];
        const status = HttpStatus[statusEnum];
        super(code, status, response || {}, options);
    }
}
