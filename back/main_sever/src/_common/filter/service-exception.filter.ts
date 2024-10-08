import { Inject, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';
import { ServiceException } from '../exception/service-exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { BaseException } from '../exception/common/base.exception';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomExceptionFilter } from './common/custom-base-exception.filter';
import { ServiceExceptionEnum } from '../exception/common/enum/service-exception-code.enum';

interface IExceptionInfo extends Pick<BaseException, 'timestamp' | 'path'> {
    message: string | object;
    cause?: unknown;
}

@Catch(ServiceException)
export class ServiceExceptionFilter extends CustomExceptionFilter {
    constructor(private readonly loggerUsecase: LoggerUsecase) {
        super(loggerUsecase, 'ServiceExceptionFilter');
    }

    catch(exception: ServiceException, host: ArgumentsHost): void {
        super.catch(exception, host);

        const code = exception.errorCode;

        if (code == ServiceExceptionEnum.DB_INCONSISTENCY) {
            // notfiy to Developer.
            this.loggerUsecase.error('DB has inconsistency', exception.stack, {
                className: this.className,
                traceId: exception.traceId,
            });
        }
    }
}
