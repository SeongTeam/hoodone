import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    ValidationPipe,
    BadRequestException,
    UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUseCase } from './usecase/user.use-case';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner as QR } from 'typeorm';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { TempUserModel } from './entities/temp-user.entity';
import { TempUserUseCase } from './usecase/temp-user.case';
import { CommonExceptionFilter } from 'src/common/filter/common-exception.filter';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userUseCase: UserUseCase,
        private readonly tempUserUseCase: TempUserUseCase,
    ) {}

    @Post('/tempUser')
    @UseInterceptors(TransactionInterceptor)
    @UseFilters(CommonExceptionFilter)
    async postTempUser(
        @Body(ValidationPipe) userInfo: Pick<TempUserModel, 'email'>,
        @QueryRunner() qr: QR,
    ) {
        const { email } = userInfo;
        const isExist = await this.userUseCase.hasExistedEmail(email);
        if (isExist)
            throw new BadRequestException('이미 사용 중인 email, createNewTempUser() 취소');

        // 처음에 생성할 때는 pinCode가 필요 없기에 빈 문자열 사입
        return this.tempUserUseCase.upsertTempUser(email, '', qr);
    }

    @Patch('/tempUser')
    comparePINCodes(@Body(ValidationPipe) userInfo: Pick<TempUserModel, 'email' | 'pinCode'>) {
        return this.tempUserUseCase.comparePinCodes(userInfo);
    }

    @Get('/all')
    // 직렬화를 할 때 데이터 포맷을 변경 (@Exclude()를 이용하면 제거 가능)
    // @UseInterceptors(ClassSerializerInterceptor) // AppModule에서 전체 적용으로 설정가능
    /**
     * serialization -> 직렬화 -> 현재 시스템에서 사용되는 (NestJS) 데이터의 구조를 다른 시스템에서도 쉽게
     *                          사용 할 수 있는 포맷으로 변환
     *                        -> class의 object에서 JSON 포맷으로 변환
     * deserialization -> 역직렬화
     */
    getUsers() {
        return this.userUseCase.getAllUsers();
    }
    @Get('/email/:email')
    getByEmail(@Param('email') email: string) {
        console.log('calling /email:email ');

        return this.userUseCase.getUserByEmail(email);
    }
    @Get('/nickname/:nickname')
    getById(@Param('nickname') nickname: string) {
        return this.userUseCase.getUserByNickname(nickname);
    }
}
