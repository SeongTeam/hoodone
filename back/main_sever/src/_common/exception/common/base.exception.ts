import { HttpStatus, Logger } from '@nestjs/common';
import { HttpException, HttpExceptionOptions } from '@nestjs/common/exceptions';
import { ApiProperty } from '@nestjs/swagger';
import { error } from 'console';

interface IBaseException {
    errorCode: number;
    timestamp: string;
    //pastMsg: any; // error.cause = prevError  로 대체하므로 삭제 예정
    msg: string;
    path: string;
}

export type HttpStatusType = keyof typeof HttpStatus;

export class BaseException extends HttpException implements IBaseException {
    constructor(
        errorCode: number,
        status: number,
        response: Record<string, any> | string,
        options?: HttpExceptionOptions,
    ) {
        let resbody = typeof response === 'string' ? { message: response } : response;

        resbody['errorCode'] = errorCode;
        resbody['status'] = status;
        super(resbody, status, options);
        this.errorCode = errorCode;
        this.msg = JSON.stringify(resbody, null, 2);
    }

    @ApiProperty()
    errorCode: number;

    @ApiProperty()
    timestamp: string;

    @ApiProperty()
    msg: string;

    @ApiProperty()
    path: string;
}
