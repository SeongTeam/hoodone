import { HttpException } from '@nestjs/common/exceptions';
import { ApiProperty } from '@nestjs/swagger';

// todo interface를 따로 관리할 파일 만들기
interface IBaseException {
  errorCode: number;
  timestamp: string;
  statusCode: number;
  message: string;
  pastMsg?: string;
  path: string;
}

export class BaseException extends HttpException implements IBaseException {
  constructor(errorCode: number, statusCode: number, message: string, pastMsg?: string) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.message = message;
    this.pastMsg = pastMsg;
  }

  @ApiProperty()
  errorCode: number;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  pastMsg?: string;

  @ApiProperty()
  path: string;
}
