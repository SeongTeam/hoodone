export const ExceptionErrorCode = {
  // 회원가입 관련
  ACCOUNT_CREATION_FAILED: 10000,
  EMAIL_EXISTS: 10001,
  NICKNAME_EXISTS: 10002,

  // 로그인 관
  LOGIN_FAILED: 10010,
  EMAIL_NOT_FOUND: 10011,
  INCORRECT_PASSWORD: 10012,

  //JWT 관련
  JWT_ERROR: 10100,
  JWT_NOT_FOUND_TOKEN: 10101,
  JWT_INVALID_TOKEN_OR_NO_BEARER_BASIC: 10102,
  JWT_TOKEN_FORMAT_ERROR: 10103,
  JWT_INVALID_TOKEN: 10104,
  ACCESS_TOKEN_ERROR: 10120,
  ACCESS_TOKEN_TYPE_MISMATCH: 10121,
  REFRESH_TOKEN_ERROR: 10140,
  REFRESH_TOKEN_TYPE_MISMATCH: 10121,
} as const;
