import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { LoggerConTextMiddleware } from './middleware/logger-context.middleware';
import { LoggerUsecase } from '@/_common/provider/LoggerUsecase';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './interceptor/logging.interceptor';
import { TraceInterceptor } from './interceptor/trace.interceptor';
import { LoggerModule } from '@/logger/logger.module';

@Module({
    imports: [LoggerModule],
    controllers: [CommonController],
    providers: [
        CommonService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TraceInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpLoggingInterceptor,
        },
    ],
})
export class CommonModule {}
