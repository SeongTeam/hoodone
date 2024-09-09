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

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
    className = 'CommonExceptionFilter';
    constructor(private readonly loggerUseCase: LoggerUsecase) {}
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const _exception =
            exception instanceof BaseException ? exception : new UnCatchedException();

        _exception.timestamp = new Date().toLocaleString('kr');
        _exception.path = request.url;
        const errCode = _exception.errorCode;

        const statusCode = this.getHttpStatus(exception);
        const errorResponse = {
            targetRequest: exception[LoggerUsecase.KEY.traceReq],
            errorCode: _exception.errorCode,
            statusCode: statusCode,
            timestamp: _exception.timestamp,
            detail: {
                message: _exception.getResponse?.(),
                pst: _exception.pastMsg,
                describe: _exception.describe,
            },
            path: _exception.path,
            method: request.method,
        };

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.loggerUseCase.error(
                {
                    err: errorResponse,
                },
                exception.stack,
                this.className,
            );
        } else {
            this.loggerUseCase.warn(errorResponse, this.className);
        }

        switch (errCode) {
            case InterceptorExceptionCodeEnum.transaction:
                const pastErrorRes = {
                    errorCode: _exception.pastMsg.errorCode,
                    statusCode: _exception.pastMsg.getStatus?.(),
                    timestamp: _exception.timestamp,
                    detail: {
                        message: _exception.pastMsg.getResponse?.(),
                        describe: _exception.pastMsg.describe,
                    },
                    path: _exception.path,
                    method: _exception.pastMsg.method,
                };
                this.loggerUseCase.error({ err: pastErrorRes }, exception.stack, this.className);
                response.status(_exception.getStatus()).json(pastErrorRes);
                break;

            default:
                response.status(_exception.getStatus()).json(errorResponse);
        }
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
