import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            /* 기존 providers는 사용하면 에러 발생 아래와 같이 변화 시킴 
             이유:  
            providers: [ 
                //https://stackoverflow.com/questions/62 822943/nestjs-typeorm-unit-testing-cant-resolve-dependencies-of-jwtservice
                // 추가 후 AuthService 사용가능
                {
                    provide: AuthService,
                    useValue: {
                        registerUserAsync: jest.fn(), // <--here
                    },
                },
            ],*/

            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        // 필요한 JwtService 메서드들을 mock으로 설정합니다.
                        sign: jest.fn(() => 'mockJwtToken'),
                    },
                },
                ConfigService,
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    describe('inCodingPassword', () => {
        it('inCodingPassword throw error', async () => {
            let password = await authService.inCodingPassword({ password: '12345678' });
            console.log(password);
            await expect(password).resolves;
        });
    });
});
