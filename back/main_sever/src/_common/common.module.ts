import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { LoggerConTextMiddleware } from './middleware/logger-context.middleware';
import { LoggerUsecase } from '@/_common/provider/LoggerUsecase';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './interceptor/logging.interceptor';

@Module({
    controllers: [CommonController],
    providers: [
        CommonService,
        Logger,
        LoggerUsecase,
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpLoggingInterceptor,
        },
    ],
    exports: [LoggerUsecase],
})
export class CommonModule {}
