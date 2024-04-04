// exception message는 1개에 파일에서 관리하자

export const authExceptionMsg = {
  // 회원가입 & 닉네임 관련
  error10000: '회원가입 실패',
  error10001: '이미 존재하는 email입니다. 다른 email을 사용해 주세요',
  error10002: '이미 존재하는 닉네임',

  //login 관련
  error10010: '로그인 중 에러 발생',
  error10011: '존재하지 않는 계정',
  error10012: '비밀번호가 올바르지 않습니다',

  //JWT 관련
  error10100: '토큰 관련 오류 발생',
  error10101: '토큰이 없습니다',
  error10102: '잘못된 토큰 또는 Bearer, Basic이 없습니다',
  error10103: '토큰의 내용이 형식이 올바르지 않습니다',
  error10104: '토큰이 만료되거나 잘못된 토큰입니다',
  error10120: 'access token 에러가 발생',
  error10121: '토큰 타입이 access가 아닙니다.',
  error10140: 'refresh token 에러 발생',
  error10141: '토큰 타입이 refresh가 아닙니다',
} as const;
