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

    const _exception = exception instanceof BaseException ? exception : new UnCatchedException();

    _exception.timestamp = new Date().toLocaleString('kr');
    _exception.path = request.url;

    // 주후 message formate을 변동할때 참고
    //  const message = `${result.errorCode}-${result.timestamp}\n${exception['message']}`
    const messageList = (response.statusCode as any).messageList || [];
    if (_exception.pastMsg) {
      messageList.push(_exception.pastMsg);
    }

    response.status(_exception.statusCode).json({
      errorCode: _exception.errorCode,
      statusCode: _exception.statusCode,
      timestamp: _exception.timestamp,
      message: exception['message'],
      msgHistory: messageList,
      path: _exception.path,
    });
  }
}
