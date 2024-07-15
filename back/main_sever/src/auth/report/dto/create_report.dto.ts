import { IsString } from 'class-validator';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';

export class CreateReportDto {
    @IsString({ message: stringValidationMessage })
    reportEnum: string; // 1) 유일무이한 값이 될 것

    @IsString({ message: stringValidationMessage })
    content: string;

    @IsString({ message: stringValidationMessage })
    target: string;

    @IsString()
    id: string;
}
