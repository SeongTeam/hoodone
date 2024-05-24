import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { BoardsModule } from 'src/boards/boards.module';
import { TypeormConfig } from 'src/configs/typeorm.config';
import { PostsModule } from 'src/posts/post.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './posts/comment/comment.module';
import { LocalTypeormConfig } from './configs/local-typeorm.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import {
    ENV_SMTP_FROM_EMAIL,
    ENV_SMTP_ID,
    ENV_SMTP_PORT,
    ENV_SMTP_PW,
} from './common/const/env-keys.const';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MailerModule.forRoot({
            transport: {
                host: 'localhost:3000', //TODO)서버 host를 넣어야 한다,
                port: +process.env[ENV_SMTP_PORT],
                secure: false,
                service: 'gmail',
                auth: {
                    user: process.env[ENV_SMTP_ID],
                    pass: process.env[ENV_SMTP_PW],
                },
            },
            defaults: {
                from: process.env[ENV_SMTP_FROM_EMAIL],
            },
            template: {
                dir: __dirname + '/mail/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        MailModule,

        TypeOrmModule.forRootAsync({
            useClass: LocalTypeormConfig, // TODO: typeorm 설정한 클래스

            // useClass: TypeormConfig, // TODO: typeorm 설정한 클래스
            dataSourceFactory: async (options: DataSourceOptions) => {
                return new DataSource(options).initialize();
            },
        }),
        AuthModule,
        UsersModule,
        CommonModule,
        BoardsModule,
        PostsModule,
        CommentModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
})
export class AppModule {}
