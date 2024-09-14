import { Inject, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ServiceException } from '../exception/service-exception';
import { LoggerUsecase } from '../provider/LoggerUsecase';
import { CustomExceptionFilter } from './custom-base-exception.filter';
import { AuthException } from '../exception/auth-exception';
import { AuthExceptionEnum } from '../exception/common/enum/auth-exception-code.enum';

/*
 */
@Catch(AuthException)
export class AuthExceptionFilter extends CustomExceptionFilter {
    constructor(private readonly loggerUsecase: LoggerUsecase) {
        super(loggerUsecase, 'AuthExceptionFilter');
        this.loggerUsecase.log(`successfully mounted`, this.className);
    }

    catch(exception: ServiceException, host: ArgumentsHost): void {
        const code = exception.errorCode;

        super.catch(exception, host);

        if (code >= AuthExceptionEnum.CREDENTIALS_REVOKED) {
            this.loggerUsecase.error('Serious Excpetion', exception.stack, this.className);
        }
    }
}
