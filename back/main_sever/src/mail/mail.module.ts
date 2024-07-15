import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailUseCase } from './usecase/mail.usecase';

@Module({
    imports: [],
    controllers: [],
    providers: [MailService, MailUseCase],
    // providers: [TempUserUseCase, UserUseCase, UsersService],
    exports: [MailUseCase],
})
export class MailModule {}
