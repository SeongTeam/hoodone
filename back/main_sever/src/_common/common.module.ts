import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { LoggerConTextMiddleware } from './middleware/logger-context.middleware';

@Module({
    controllers: [CommonController],
    providers: [CommonService, Logger],
    exports: [CommonService, Logger],
})
export class CommonModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerConTextMiddleware).forRoutes('*');
    }
}
