import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { passwordValidationMessage } from 'src/common/validation-message/password-vaildation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';

export class ResetPasswordRequestDto extends PickType(UserModel, ['email', 'password']) {
    @IsString({ message: stringValidationMessage })
    @IsEmail({}, { message: emailValidationMessage })
    email: string; // 1) 유일무이한 값이 될 것

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    //영어, 숫자, 특수문자 각각 1개씩 필요 가능한 유효성 체크
    @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{3,}$/, {
        message: passwordValidationMessage,
    })
    password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(8)
    pinCode: string;
}
