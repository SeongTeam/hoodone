import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { AuthUseCase } from './auth.use-case';
import { AuthService } from '../auth.service';
import { TempUserUseCase } from '@/users/usecase/temp-user.case';
import { MailUseCase } from '@/mail/usecase/mail.usecase';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TempUserModel } from 'src/users/entities/temp-user.entity';
import { UserModel } from '@/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';
import { UserUseCase } from '@/users/usecase/user.use-case';
import { UsersService } from '@/users/users.service';
import { TicketService } from '@/users/_tickets/ticket.service';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { TicketModel } from '@/users/_tickets/entities/ticket.entity';
import { TypeormConfig } from '@/_configs/typeorm.config';

describe('AuthUseCase', () => {
    let authUseCase: AuthUseCase;
    let userRepository: Repository<UserModel>;
    let tempUserRepository: Repository<TempUserModel>;
    let ticketRepository: Repository<TicketModel>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AuthUseCase,
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        // 필요한 JwtService 메서드들을 mock으로 설정합니다.
                        sign: jest.fn(() => 'mockJwtService'),
                    },
                },
                // MailService,
                MailUseCase,
                MailService,
                {
                    provide: MailerService,
                    useValue: {
                        // 필요한 JwtService 메서드들을 mock으로 설정합니다.
                        sign: jest.fn(() => 'mockMailerService'),
                    },
                },
                ConfigService,
                UserUseCase,
                UsersService,
                {
                    provide: getRepositoryToken(UserModel),
                    useValue: Repository<UserModel>,
                },
                TempUserUseCase,
                {
                    provide: getRepositoryToken(TempUserModel),
                    useValue: Repository<TempUserModel>,
                },
                TicketService,
                {
                    provide: getRepositoryToken(TicketModel),
                    useValue: Repository<TicketModel>,
                },
                ConfigService,
            ],
        })

            .compile();

        authUseCase = module.get<AuthUseCase>(AuthUseCase);
        userRepository = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));
        tempUserRepository = module.get<Repository<TempUserModel>>(
            getRepositoryToken(TempUserModel),
        );
        ticketRepository = module.get<Repository<TicketModel>>(getRepositoryToken(TicketModel));
    });

    it('should be defined', () => {
        expect(authUseCase).toBeDefined();
    });
    // describe('inCodingPassword', () => {
    //     it('inCodingPassword throw error', async () => {
    //         let password = await authUseCase.verifyToken(
    //             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNqbTQxMjYxQG5hdmVyLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MjcwNzMyNzIsImV4cCI6MTcyNzA3Njg3Mn0.oB0oEHQCfqdiLB5VJM3AC1WEtowQey-wmjzgq3AqTas',
    //         );
    //         console.log(password);
    //         await expect(password).resolves;
    //     });
    // });
    describe('loginWithEmail', () => {
        it('loginWithEmail throw error', async () => {
            let tokens = await authUseCase.loginWithEmail({
                email: 'sjm41261@naver.com',
                password: '1234@qwer',
            });
            console.log(tokens.accessToken);
            await expect(tokens.accessToken).resolves;
        });
    });
});
