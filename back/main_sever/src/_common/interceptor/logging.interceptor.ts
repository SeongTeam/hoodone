import { LoggerUsecase } from '@/_common/provider/LoggerUsecase';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Response, Request } from 'express';
import { PickType } from '@nestjs/swagger';
import { AuthUseCase } from '@/auth/usecase/auth.use-case';
import { ModuleRef } from '@nestjs/core';
import { isObject, isString } from 'class-validator';
import { emit } from 'process';

interface HttpInfo {
    request: Request;
    response: Response;
    body: any;
}
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    authUsecase: AuthUseCase;

    className = 'HttpLoggingInterceptor';

    isProduction = process.env['NODE_ENV'] === 'production';
    constructor(
        private readonly loggerUsecase: LoggerUsecase,
        private moduleRef: ModuleRef,
    ) {
        this.authUsecase = this.moduleRef.get(AuthUseCase, { strict: false });
    }
    intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
        const hostType = context.getType();

        if (hostType != 'http') {
            return call$.handle();
        }

        return call$.handle().pipe(
            tap({
                next: (val: any): void => {
                    const info = this.logNext(val, context);
                    this.logDebug(info);
                },
                error: (err: any): void => {
                    this.logError(err, context);
                },
            }),
        );
    }

    logNext(val: any, ctx: ExecutionContext) {
        const response = ctx.switchToHttp().getResponse<Response>();
        const request = ctx.switchToHttp().getRequest<Request>();
        const handlerKey = ctx.getHandler().name;
        const status = response.statusCode;
        const { method, originalUrl: url, ip, query, params, headers } = request;
        this.loggerUsecase.log(
            `accessing [${handlerKey}()] ${method}::${url} from ${ip}\n` +
                `status : ${status} \n` +
                `header : ${JSON.stringify(headers, null, 2)}` +
                `Params: ${JSON.stringify(params)}` +
                `Query: ${JSON.stringify(query)}`,
            this.className,
        );

        return { request, response, body: val } as HttpInfo;
    }
    logDebug(v: HttpInfo) {
        //For Debuging
        const { body } = v.request;
        const email = this.getUserEmail(v.request);

        this.loggerUsecase.debug(
            `----Develop log---\n` +
                `user: "${email}"\n` +
                `[REQUEST] \n` +
                `Body: ${JSON.stringify(body, null, 2)}\n` +
                `[RESPONSE]\n` +
                `body :${JSON.stringify(v.body, null, 2)}`,
            this.className,
        );
    }

    logError(error: any, ctx: ExecutionContext) {
        const request = ctx.switchToHttp().getRequest<Request>();

        const { method, originalUrl: url, params, query, body, headers, ip } = request;
        const handlerkey = ctx.getHandler().name;
        const email = this.getUserEmail(request);

        const httpStatus = error.status;

        const format =
            `accessing ${handlerkey} handler\n` +
            `${method}::${url} from ${ip}\n` +
            `Status : ${httpStatus} \n` +
            `User: ${email} \n` +
            `[REQUEST] \n` +
            `Params: ${JSON.stringify(params)} \n` +
            `Query: ${JSON.stringify(query)} \n` +
            `Body: ${JSON.stringify(body, null, 2)}\n` +
            `Headers: ${JSON.stringify(headers, null, 2)}\n`;

        if (httpStatus < 500) {
            this.loggerUsecase.warn(format, this.className);
        } else {
            this.loggerUsecase.error(format, error.stack, this.className);
        }
    }

    getUserEmail(req: Request) {
        let email = null;

        const rawToken = req.get('authorization');
        if (rawToken == undefined) {
            return email;
        }

        const [type, token] = rawToken.split(' ');

        if (type != 'bearer') {
            return email;
        }

        email = this.authUsecase.getEmailByToken(token);

        return email;
    }
}
