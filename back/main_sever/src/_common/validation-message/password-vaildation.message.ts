import { ValidationArguments } from 'class-validator';

export const passwordValidationMessage = (args: ValidationArguments) => {
    // return `비밀번호는 영어와 숫자만 입력가능 합니다!`;
    return 'password only accepts english, number, !@#$%^*+=-, and contains at least 1 character for each';
};
