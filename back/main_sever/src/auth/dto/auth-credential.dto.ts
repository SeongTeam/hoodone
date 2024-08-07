import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { emailValidationMessage } from 'src/_common/validation-message/email-validation.message';
import { passwordValidationMessage } from 'src/_common/validation-message/password-vaildation.message';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';

// 유저가 로그인할떄 사용할 DTO [email, password]`
// todo RegisterUserDto 처럼 사용하지 논의필요
export class AuthCredentialsDto {
    @IsString({ message: stringValidationMessage })
    @IsEmail({}, { message: emailValidationMessage })
    email: string; // 1) 유일무이한 값이 될 것

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능한 유효성 체크
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: passwordValidationMessage,
    })
    password: string;
}
// todo DTO는 파일 1개에 1개만 분리해야 함
// 유저기 회원가입 할때 사용할 DTO
