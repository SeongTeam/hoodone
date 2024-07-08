import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/_common/common.module';

import { PostsUseCases } from './usecase/post.use-case';
import { BoardModule } from 'src/boards/boards.module';
import { QuestPostModel } from './entities/quest_post.entity';
import { SbPostModel } from './entities/sb_post.entity';
import { QuestPostsController as QuestPostController } from './-quest/quest_post.controller';
import { SbPostsController as SbPostController } from './-sb-post/sb_post.controller';
import { QuestPostsService } from './-quest/quest_post.service';
import { SbPostsService } from './-sb-post/sb_post.service';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestPostModel, SbPostModel]),
        AuthModule,
        UsersModule,
        CommonModule,
        BoardModule,
        FavoriteModule,
    ],
    controllers: [QuestPostController, SbPostController],

    providers: [QuestPostsService, SbPostsService, PostsUseCases],
    exports: [PostsUseCases],
})
export class PostsModule {}
