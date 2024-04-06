import { Injectable } from '@nestjs/common/decorators';
import {
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common/exceptions';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common/interfaces';
import { Observable, catchError, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { UnCatchedException } from '../exception/uncatch.exception';
import { InterceptorException } from '../exception/interceptor-exception';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // 트랜잭션과 관련된 모든 쿼리를 담당할
    // 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리 러너에 연결한다.
    await qr.connect();
    // 쿼리 러너에서 트랜잭션을 시작한다.
    // 이 시점부터 같은 쿼리 러너를 사용하면
    // 트랜잭션 안에서 데이터베이스 액션을 실행 할 수 있다.
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();
        console.log('트랜잭션 실행 에러 발생'); // todo log로직 middle ware로 이동
        throw new InterceptorException({
          message: 'TransactionInterceptor에서 에러 발생',
          pastMsg: e,
        });
      }),
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
