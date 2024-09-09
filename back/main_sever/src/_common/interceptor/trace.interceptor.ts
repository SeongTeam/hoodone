import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    LoggerService,
    NestInterceptor,
} from '@nestjs/common';
import { trace } from 'console';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Observable, catchError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LoggerUsecase } from '../provider/LoggerUsecase';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
    className = `TraceInterceptor`;
    constructor(
        private readonly clsService: ClsService,
        private readonly logger: LoggerUsecase,
    ) {}

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        if (ctx.getType() == 'http') {
            const req = ctx.switchToHttp().getRequest<Request>();
            const traceId = req.headers['x-request-id'] || uuidv4();
            this.clsService.set(LoggerUsecase.KEY.traceReq, traceId);

            return next.handle().pipe(
                catchError((err) => {
                    const key = LoggerUsecase.KEY.traceReq;
                    err[key] = this.clsService.get(key);
                    throw err;
                }),
            );
        } else {
            this.logger.warn('Undefined communicate Approach', this.className);
            return next.handle();
        }
    }
}
