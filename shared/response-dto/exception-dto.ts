export class ExceptionDto {
    errorCode?: number; // 미리 정의해둔 hoodone 에러 코드
    statusCode?: string;
    timestamp?: string; // 에러발생 시간
    detail?: {
        message: string; // 미리 정의해둔  hoodone 에러 메세지
        pst: any; // 이전에 에러 정보
        describe: string; // 에러에 대한 상세 정보 (개발자가 개발할떄 집어 둘 수 있음)
    };
    path?: string; // 에러 발생 위치
}
