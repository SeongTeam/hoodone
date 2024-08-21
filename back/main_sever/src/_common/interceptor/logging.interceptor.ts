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
import { tap } from 'rxjs/operators';
import { Response, Request } from 'express';
import { PickType } from '@nestjs/swagger';
import { AuthUseCase } from '@/auth/usecase/auth.use-case';
import { ModuleRef } from '@nestjs/core';
import { isObject, isString } from 'class-validator';
import { emit } from 'process';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    authUsecase: AuthUseCase;

    className = 'HttpLoggingInterceptor';

    isProduction = process.env['NODE_ENV'] === 'production';
    constructor(
        @Inject(LoggerUsecase) private readonly loggerUsecase: LoggerUsecase,
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
                    this.logNext(val, context);
                },
                error: (err: Error): void => {
                    this.logError(err, context);
                },
            }),
        );
    }
    // 에러시에만 상세한 request 정보 로그
    // 에러가 아니면, method, status, url , 사용자 이메일만
    logNext(val: any, ctx: ExecutionContext) {
        const response = ctx.switchToHttp().getResponse<Response>();
        const request = ctx.switchToHttp().getRequest<Request>();
        const handlerkey = ctx.getHandler().name;
        const status = response.statusCode;

        const { method, originalUrl: url } = request;

        this.loggerUsecase.log(
            `[${this.className}] accessing ${handlerkey} ${method} ${url} ${status} \n`,
        );

        //For Debuging
        const { params, query, body, headers } = request;
        const email = this.getUserEmail(request);

        this.loggerUsecase.debug(
            `----Develop log---\n` +
                `user: "${email}"\n` +
                `[REQUEST] \n` +
                `Params: ${JSON.stringify(params)} \n` +
                `Query: ${JSON.stringify(query)} \n` +
                `Body: {\n${JSON.stringify(body, null, 2)}\n}\n` +
                `Headers: { \n${JSON.stringify(headers, null, 2)} \n}\n` +
                `[RESPONSE]\n` +
                `body :${JSON.stringify(val, null, 2)}`,
        );
    }

    logError(error: Error, ctx: ExecutionContext) {
        const response = ctx.switchToHttp().getRequest<Response>();
        const request = ctx.switchToHttp().getRequest<Request>();

        const status = response.statusCode;
        const { method, originalUrl: url, params, query, body, headers } = request;
        const handlerkey = ctx.getHandler().name;
        const email = this.getUserEmail(request);

        if (status < 500) {
            this.loggerUsecase.warn(
                `[${this.className}] WARNING accessing ${handlerkey} handler by User: ${email}\n` +
                    `${method}-${url}-${status}\n` +
                    `[REQUEST] \n` +
                    `Params: ${JSON.stringify(params)} \n` +
                    `Query: ${JSON.stringify(query)} \n` +
                    `Body: {\n${JSON.stringify(body, null, 2)}\n}\n` +
                    `Headers: { \n${JSON.stringify(headers, null, 2)} \n}\n`,
            );
        } else {
            this.loggerUsecase.error(
                `[${this.className}}] ERROR accessing ${handlerkey} handler by User: ${email}\n` +
                    `${method}-${url}-${status}\n` +
                    `[REQUEST] \n` +
                    `Params: ${JSON.stringify(params)} \n` +
                    `Query: ${JSON.stringify(query)} \n` +
                    `Body: {\n${JSON.stringify(body, null, 2)}\n}\n` +
                    `Headers: { \n${JSON.stringify(headers, null, 2)} \n}\n`,
                error.stack,
                { error },
            );
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
