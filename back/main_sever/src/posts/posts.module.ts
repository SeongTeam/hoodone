import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsModel } from './entities/posts.entity';
import { PostsUseCases } from './usecase/post.use-case';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  
  providers: [PostsService, PostsUseCases],
  exports: [PostsUseCases]
})
export class PostsModule {}
