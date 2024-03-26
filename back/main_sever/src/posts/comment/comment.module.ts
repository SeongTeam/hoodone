import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { CommentModel } from './entities/comments.entity';
import { PostsModel } from '../entities/posts.entity';
import { CommentUseCases } from './usecase/comment.use-case';

export const COMMENT_USE_CASES = Symbol('COMMENT_USE_CASES');


@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentModel,
    ]),
  PostsModel,
  CommonModule,
  AuthModule,
  UsersModule

  ],
  controllers: [CommentsController],
  providers: [
    CommentUseCases,
    CommentsService
  ],
})
export class CommentModule {}
