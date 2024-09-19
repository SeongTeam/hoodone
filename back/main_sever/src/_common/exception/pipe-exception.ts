import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { BaseException, HttpStatusType } from './common/base.exception';
import { PipeExceptionEnum } from './common/enum/pipe-exception-code.enum';

type PipeExceptionEnumType = keyof typeof PipeExceptionEnum;

export class PipeException extends BaseException {
    constructor(
        ExceptionEnum: PipeExceptionEnumType,
        statusEnum: HttpStatusType,
        validationMessage?: string[],
        options?: HttpExceptionOptions,
    ) {
        const code = PipeExceptionEnum[ExceptionEnum];
        const status = HttpStatus[statusEnum];
        super(code, status, {}, options);

        this.validationMessage = validationMessage;
    }

    validationMessage: string[];
}
