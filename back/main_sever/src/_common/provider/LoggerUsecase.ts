import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggerUsecase {
    static KEY = {
        traceReq: 'traceId',
    };

    constructor(
        private readonly logger: Logger,
        private readonly clsService: ClsService,
    ) {}

    debug(message: any, context: string) {
        return this.logger.debug(message, this.getFullContext(context));
    }
    log(message: any, context: string) {
        return this.logger.log(message, this.getFullContext(context));
    }
    error(message: any, stack: string, context: string) {
        return this.logger.error(message, stack, this.getFullContext(context));
    }

    fatal(message: any, stack: string, context: string) {
        return this.logger.fatal(message, stack, this.getFullContext(context));
    }
    verbose(message: any, context: string) {
        return this.logger.verbose(message, this.getFullContext(context));
    }
    warn(message: any, context: string) {
        return this.logger.warn(message, this.getFullContext(context));
    }

    private getFullContext(ctx: string) {
        const reqInfo = this.clsService.get(LoggerUsecase.KEY.traceReq) || '';
        return `${ctx} , req{${reqInfo}}`;
    }
}
