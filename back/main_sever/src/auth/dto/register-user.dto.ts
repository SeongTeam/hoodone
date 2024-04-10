import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';

/** 회원가입 때 사용할 DTO ['nickName', 'email', 'password']  */
export class RegisterUserDto extends PickType(UserModel, ['nickname', 'email', 'password']) {
    @IsString({ message: stringValidationMessage })
    nickName: string; // 1) 유일무이 하지만 수정가능한 정보

    @IsString({ message: stringValidationMessage })
    @IsEmail({}, { message: emailValidationMessage })
    email: string; // 1) 유일무이한 값이 될 것

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    //영어랑 숫자만 가능한 유효성 체크
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number',
    })
    password: string;
}
