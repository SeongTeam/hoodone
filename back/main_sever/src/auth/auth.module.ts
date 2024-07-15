import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthUseCase } from './usecase/auth.use-case';
import { MailModule } from 'src/mail/mail.module';
import { TempUserModel } from 'src/users/entities/temp-user.entity';
import { ReportController } from './report/_report_controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel]),
        UsersModule,
        // JwtModule.register({})를 주석 처리했기에 뜨는 에러입니다
        JwtModule.register({}),
        MailModule,
        TempUserModel,
    ],
    exports: [AuthUseCase],
    controllers: [AuthController, ReportController],
    // 인스턴스화 없이 IOC container에서 class를 사용가능
    providers: [AuthService, AuthUseCase],
})
export class AuthModule {}
