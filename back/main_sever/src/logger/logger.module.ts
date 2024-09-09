import { Logger, Module } from '@nestjs/common';
import { LoggerUsecase } from '@/_common/provider/LoggerUsecase';

@Module({
    providers: [LoggerUsecase, Logger],
    exports: [LoggerUsecase],
})
export class LoggerModule {}
