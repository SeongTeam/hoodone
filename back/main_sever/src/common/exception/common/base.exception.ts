import { HttpException } from '@nestjs/common/exceptions';
import { ApiProperty } from '@nestjs/swagger';

interface IBaseException {
    errorCode: number;
    timestamp: string;
    pastMsg: any;
    describe: string;
    path: string;
}

export class BaseException extends HttpException implements IBaseException {
    constructor(
        errorCode: number,
        status: number,
        response: string,
        detailInfo?: {
            describe?: string;
            pastMsg?: string;
        },
    ) {
        super(response, status);
        this.errorCode = errorCode;
        this.describe = detailInfo?.describe ?? '';
        this.pastMsg = detailInfo?.pastMsg ?? '';
    }

    @ApiProperty()
    errorCode: number;

    @ApiProperty()
    timestamp: string;

    @ApiProperty()
    describe: string;

    @ApiProperty()
    pastMsg: any;

    @ApiProperty()
    path: string;
}
