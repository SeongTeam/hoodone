import { ValidationArguments } from "class-validator";

export const numberValidationMessage = (args: ValidationArguments) => {
    return `${args.property}에 자연수를 입력해주세요!`
}