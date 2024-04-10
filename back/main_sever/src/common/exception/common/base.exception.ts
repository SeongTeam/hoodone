import { HttpException } from '@nestjs/common/exceptions';
import { ApiProperty } from '@nestjs/swagger';

interface IBaseException {
    errorCode: number;
    timestamp: string;
    message: string;
    pastMsg: any;
    path: string;
}

export class BaseException extends HttpException implements IBaseException {
    constructor(
        errorCode: number,
        status: number,
        response: string,
        detailInfo?: {
            message?: string;
            pastMsg?: string;
        },
    ) {
        super(response, status);
        this.errorCode = errorCode;
        this.message = detailInfo.message ?? '';
        this.pastMsg = detailInfo.pastMsg;
    }

    @ApiProperty()
    errorCode: number;

    @ApiProperty()
    timestamp: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    pastMsg: any;

    @ApiProperty()
    path: string;
}
