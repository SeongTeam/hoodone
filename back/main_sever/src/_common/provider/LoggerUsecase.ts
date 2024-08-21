import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerUsecase {
    constructor(private readonly logger: Logger) {}

    debug(message: any, ...optionalParams: [...any, string?]) {
        return this.logger.debug(message, optionalParams);
    }
    log(message: any, ...optionalParams: [...any, string?]) {
        return this.logger.log(message, optionalParams);
    }
    error(message: any, stack: string, ...optionalParams: [...any, string?, string?]) {
        return this.logger.error(message, stack, optionalParams);
    }

    fatal(message: any, stack: string, ...optionalParams: [...any, string?]) {
        return this.logger.fatal(message, stack, optionalParams);
    }
    verbose(message: any, ...optionalParams: [...any, string?]) {
        return this.logger.verbose(message, optionalParams);
    }
    warn(message: any, ...optionalParams: [...any, string?]) {
        return this.logger.warn(message, optionalParams);
    }
}
