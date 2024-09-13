import { Inject, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';
import { ServiceException } from '../exception/service-exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { BaseException } from '../exception/common/base.exception';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-base-exception.filter';
import { ServiceExceptionEnum } from '../exception/common/enum/service-exception-code.enum';

interface IExceptionInfo extends Pick<BaseException, 'timestamp' | 'path'> {
    message: string | object;
    cause?: unknown;
}

@Catch(ServiceException)
export class ServiceExceptionFilter extends CustomExceptionFilter {
    constructor(private readonly loggerUsecase: LoggerUsecase) {
        super(loggerUsecase, 'ServiceExceptionFilter');
        this.loggerUsecase.log(`successfully mounted`, this.className);
    }

    catch(exception: ServiceException, host: ArgumentsHost): void {
        super.catch(exception, host);

        const code = exception.errorCode;

        if (code == ServiceExceptionEnum.DB_INCONSISTENCY) {
            // notfiy to Developer.
            this.loggerUsecase.error('DB has inconsistency', exception.stack, this.className);
        }
    }
}
