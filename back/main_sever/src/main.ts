import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston.config';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
        logger: winstonLogger,
    });

    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
