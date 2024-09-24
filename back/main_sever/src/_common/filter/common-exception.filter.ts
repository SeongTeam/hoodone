import { Catch, Inject } from '@nestjs/common/decorators';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { BaseException } from '../exception/common/base.exception';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { CustomExceptionFilter } from './common/custom-base-exception.filter';
import { Response } from 'express';
import { ServiceException } from '../exception/service-exception';
import { PipeException } from '../exception/pipe-exception';
import { ServiceExceptionEnum } from '../exception/common/enum/service-exception-code.enum';

/*TODO
 - add handling logic for each Exception 
   eg) notify to Administor that serious exception happen by using email or other things.

*/
@Catch()
export class CommonExceptionFilter extends CustomExceptionFilter {
    constructor(private readonly loggerUsecase: LoggerUsecase) {
        super(loggerUsecase, 'CommonExceptionFilter');
    }

    catch(exception: any, host: ArgumentsHost): void {
        const errName = exception.name;

        this.loggerUsecase.debug(`catch ${errName} exception`, {
            className: this.className,
            traceId: exception.traceId,
        });

        if (exception instanceof TypeORMError) {
            this.handleTypeORMException(exception, host);
        } else if (exception instanceof PipeException) {
            this.handlePipeException(exception, host);
        } else {
            super.catch(exception, host);
        }
    }

    handleTypeORMException(e: TypeORMError, host: ArgumentsHost) {
        const name = e.name;
        const info: Record<string, any> = {
            msg: `typeOrm Exception ${name} Occur, please check db log on '~/ormlogs.log' file`,
        };

        switch (name) {
            case 'QueryFailedError': {
                info.query = (e as QueryFailedError).query;
                break;
            }
            case 'EntityNotFoundError': {
                break;
            }
            default: {
            }
        }
        info.typeORMMsg = e.message;
        const err = this.convertToCustomException(
            e,
            ServiceExceptionEnum.SERVICE_RUN_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            info,
        );

        super.catch(err, host);
    }

    handlePipeException(e: PipeException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        e.timestamp = new Date().toLocaleTimeString('kr');
        e.path = req.url;

        res.status(e.getStatus()).json({
            errorCode: e.errorCode,
            status: e.getStatus(),
            timestamp: e.timestamp,
            path: e.path,
            message: e.validationMessage,
        });
    }
    convertToCustomException(
        innerError: any,
        errorCode: number,
        status: number,
        info: Record<string, any>,
    ) {
        const ret = new BaseException(errorCode, status, info, { cause: innerError });
        ret.traceId = innerError.traceId;

        return ret;
    }
}
