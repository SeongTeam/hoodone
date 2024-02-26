import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [AuthModule, UsersModule, CommonModule, BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
