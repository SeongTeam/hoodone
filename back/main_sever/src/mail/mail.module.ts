import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailUseCase } from './usecase/mail.usecase';

const SMTP_Server = 'smtp.gmail.com';
const SMTP_ID = 'hoodone9090@gmail.com';
const SMTP_PW = 'ecwoeldeinfrxqql';
const SMTP_SSL = true;
const SMTP_PORT = 587; //이건 저의 설정입니다.
const FROM_NAME = 'hoodone';
const FROM_EMAL = 'hoodone9090@gmail.com';
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'localhost:3000', //TODO) .env에 넣어서 사용하자
                port: 587,
                secure: false,
                service: 'gmail',
                auth: {
                    user: 'hoodone9090',
                    pass: SMTP_PW,
                },
            },
            defaults: {
                from: 'hoodone9090@gmail.com',
            },
            template: {
                dir: __dirname + '/mail/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [MailController],
    providers: [MailService, MailUseCase],
    // providers: [TempUserUseCase, UserUseCase, UsersService],
    exports: [MailUseCase],
})
export class MailModule {}
