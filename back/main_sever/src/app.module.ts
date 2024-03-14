import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { BoardsModule } from './boards/boards.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeormConfig } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig, // TODO: typeorm 설정한 클래스
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },],
})
export class AppModule {}
