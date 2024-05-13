import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { CommentModel } from './entities/comment.entity';
import { CommentUseCase } from './usecase/comment.use-case';
import { PostsModule } from '../post.module';

export const COMMENT_USE_CASES = Symbol('COMMENT_USE_CASES');

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentModel]),
        PostsModule,
        CommonModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [CommentsController],
    providers: [CommentUseCase, CommentsService],
})
export class CommentModule {}
