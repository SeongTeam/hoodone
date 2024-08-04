import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

/*TODO 
- Add log for user info such as userId, nickname, email from jwt token of request 
*/
@Injectable()
export class LoggerConTextMiddleware implements NestMiddleware {
    constructor(@Inject(Logger) private readonly logger: LoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl, headers } = req;
        const userAgent = req.get('user-agent');
        const dateTime = new Date();
        res.on('finish', () => {
            const { statusCode } = res;
            this.logger.log(
                `[ContextMiddleware] ${statusCode} ${method} ${originalUrl} ${ip} ${userAgent} ${dateTime}`,
            );
        });
        next();
    }
}
