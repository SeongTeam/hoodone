import { Catch, Inject } from '@nestjs/common/decorators';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { BaseException } from '../exception/common/base.exception';

import { UnCatchedException } from '../exception/uncatch.exception';
import { InterceptorExceptionCodeEnum } from '../exception/common/enum/interceptor-exception';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { QueryFailedError } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { CustomExceptionFilter } from './custom-base-exception.filter';

@Catch()
export class CommonExceptionFilter extends CustomExceptionFilter {
    constructor(private readonly loggerUsecase: LoggerUsecase) {
        super(loggerUsecase, 'CommonExceptionFilter');
        this.loggerUsecase.log(`successfully mounted`, this.className);
    }

    catch(exception: any, host: ArgumentsHost): void {
        super.catch(exception, host);
    }

    private getHttpStatus(exception: unknown): HttpStatus {
        if (
            exception instanceof QueryFailedError &&
            exception.driverError.code === 'ER_DUP_ENTRY'
        ) {
            return HttpStatus.CONFLICT;
        } else if (exception instanceof HttpException) return exception.getStatus();
        else return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}

// {
//     "errorCode": 100,
//     "statusCode": 406,
//     "timestamp": "4/23/2024, 5:31:44 PM",
//     "response": "Error-100)트랜잭션 실행 취소",
//     "message": "TransactionInterceptor에서 에러 발생",
//     "pastMsg": {
//         "response": "Error-10001):이미 존재하는 email입니다. 다른 email을 사용해 주세요",
//         "status": 401,
//         "message": "",
//         "name": "AuthException",
//         "errorCode": 10001,
//         "pastMsg": ""
//     },
//     "path": "/auth/signup"
// }
