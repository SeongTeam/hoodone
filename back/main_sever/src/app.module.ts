import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from './common/common.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommonModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
