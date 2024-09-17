import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { LoggerConTextMiddleware } from './middleware/logger-context.middleware';
import { LoggerUsecase } from '@/_common/provider/LoggerUsecase';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './interceptor/logging.interceptor';
import { TraceInterceptor } from './interceptor/trace.interceptor';
import { LoggerModule } from '@/logger/logger.module';
import { ServiceExceptionFilter } from './filter/service-exception.filter';
import { CommonExceptionFilter } from './filter/common-exception.filter';

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
        {
            provide: APP_FILTER,
            useClass: ServiceExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: CommonExceptionFilter,
        },
    ],
})
export class CommonModule {}
