import { Catch } from '@nestjs/common/decorators';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common/interfaces';
import { BaseException } from '../exception/common/base.exception';

import { UnCatchedException } from '../exception/uncatch.exception';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const _exception =
            exception instanceof BaseException ? exception : new UnCatchedException();

        _exception.timestamp = new Date().toLocaleString('kr');
        _exception.path = request.url;

        response.status(_exception.getStatus()).json({
            errorCode: _exception.errorCode,
            statusCode: _exception.getStatus(),
            timestamp: _exception.timestamp,
            response: _exception.getResponse(),
            message: _exception.message ?? '',
            pastMsg: _exception.pastMsg ?? '',
            path: _exception.path,
        });
    }
}
