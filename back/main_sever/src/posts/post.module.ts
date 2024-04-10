import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { PostModel } from './entities/post.entity';
import { PostsUseCases } from './usecase/post.use-case';
@Module({
    imports: [TypeOrmModule.forFeature([PostModel]), AuthModule, UsersModule, CommonModule],
    controllers: [PostsController],

    providers: [PostsService, PostsUseCases],
    exports: [PostsUseCases],
})
export class PostsModule {}
