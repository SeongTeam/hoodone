import { HttpStatus } from '@nestjs/common/enums';
import { BaseException } from './common/base.exception';
import { UncatchedExceptionCodeEnum } from './common/enum/uncatched-exceotion-code.enum';

export class UnCatchedException extends BaseException {
    constructor() {
        super(
            UncatchedExceptionCodeEnum.UnCatched,
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error-900)미등록 에러 발생',
        );
    }
}
