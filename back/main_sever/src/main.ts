import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { winstonLogger } from './utils/winston.config';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
        logger: winstonLogger,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
