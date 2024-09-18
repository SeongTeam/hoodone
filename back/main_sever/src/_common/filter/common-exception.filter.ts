import { Catch, Inject } from '@nestjs/common/decorators';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { BaseException } from '../exception/common/base.exception';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { CustomExceptionFilter } from './common/custom-base-exception.filter';
import { Response } from 'express';
import { ServiceException } from '../exception/service-exception';

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

        if (exception instanceof TypeORMError) {
            this.handleTypeORMException(exception, host);
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
        const newError = new ServiceException('SERVICE_RUN_ERROR', 'INTERNAL_SERVER_ERROR', info, {
            cause: e,
        });

        super.catch(newError, host);
    }
}
