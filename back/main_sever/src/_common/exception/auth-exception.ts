import { HttpStatus } from '@nestjs/common/enums';
import { BaseException, HttpStatusType } from './common/base.exception';
import { HttpExceptionOptions, InternalServerErrorException } from '@nestjs/common';
import { authExceptionMsg } from './common/const/message/exception.message';
import { AuthExceptionEnum } from './common/enum/auth-exception-code.enum';

type AuthExceptionEnumType = keyof typeof AuthExceptionEnum;
export class AuthException extends BaseException {
    /** custom Exception auth와 관련된 error message를 보낼 수 있습니다.
     *
     * - <기본 사용법> 꼭 AuthExceptionEnum 함께 사용하세요
     * new HoodOneAuthException(authExceptionCode.JWT_ERROR,);
     * => authExceptionCode에서 정의된 에러코드로 인용해서 message를 출력합니다
     *  - < pastMsg 사용법> AuthExceptionEnum 함께 사용하세요
     * new HoodOneAuthException(authExceptionCode.JWT_ERROR, pastMsg);
     * => 앞선 코드에서 발생한 에러 message를 repose 객체 저장할 수 있습니다 (사용하지 않으면 저장 불가)
     *
     */
    constructor(
        ExceptionEnum: AuthExceptionEnumType,
        statusEnum?: HttpStatusType,
        response?: Record<string, any> | string,
        options?: HttpExceptionOptions,
    ) {
        const errorCode = AuthExceptionEnum[ExceptionEnum];
        const content = authExceptionMsg[`error${errorCode}`];
        const status = HttpStatus[statusEnum || 'UNAUTHORIZED'];
        // message 형식 ex) 'Error-10141):토큰 타입이 refresh가 아닙니다',
        const bascisMsg = `Error-${errorCode}):${content}`;

        const resBody = { msg: bascisMsg, detail: response };

        /**각각에 Exception 마다  HttpStatus를 변경하는 권장합니다*/
        super(errorCode, status, resBody, options);
    }
}
