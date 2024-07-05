import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { BaseException } from './common/base.exception';
import { PostExceptionEnum } from './common/enum/post-exception-code.enum';

type PostExceptionEnumType = keyof typeof PostExceptionEnum;

export class PostException extends BaseException {
    constructor(
        ExceptionEnum: PostExceptionEnumType,

        detailInfo?: { describe?: string; pastMsg?: any },
    ) {
        // message 형식 ex) 'Error-10141):토큰 타입이 refresh가 아닙니다',

        const errorCode = PostExceptionEnum[ExceptionEnum];
        const content = `ExceptionEnum\berror${errorCode}`;
        // message 형식 ex) 'Error-10141):토큰 타입이 refresh가 아닙니다',
        const response = `Error-${errorCode}):${content}`;

        if (!errorCode) {
            throw new InternalServerErrorException(
                ` errorCod값이  undefined 입니다. ${ExceptionEnum}은 ExceptionErrorCode에 정의되지 않은 에러입니다`,
            );
        }
        /**각각에 Exception 마다  HttpStatus를 변경하는 권장합니다*/
        super(errorCode, HttpStatus.NOT_ACCEPTABLE, response, detailInfo);
    }
}
