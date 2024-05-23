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

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
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
        MailModule,
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
