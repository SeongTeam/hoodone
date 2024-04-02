export const AuthExceptionEnum = {
  ACCOUNT_CREATION_FAILED: 'ACCOUNT_CREATION_FAILED',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  NICKNAME_EXISTS: 'NICKNAME_EXISTS',

  LOGIN_FAILED: 'LOGIN_FAILED',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',

  JWT_ERROR: 'JWT_ERROR',
  JWT_NOT_FOUND_TOKEN: 'JWT_NOT_FOUND_TOKEN',
  JWT_INVALID_TOKEN_OR_NO_BEARER_BASIC: 'JWT_INVALID_TOKEN_OR_NO_BEARER_BASIC',
  JWT_TOKEN_FORMAT_ERROR: 'JWT_TOKEN_FORMAT_ERROR',
  JWT_INVALID_TOKEN: 'JWT_INVALID_TOKEN',

  ACCESS_TOKEN_ERROR: 'ACCESS_TOKEN_ERROR',
  ACCESS_TOKEN_TYPE_MISMATCH: 'ACCESS_TOKEN_TYPE_MISMATCH',
  REFRESH_TOKEN_ERROR: 'REFRESH_TOKEN_ERROR',
  REFRESH_TOKEN_TYPE_MISMATCH: 'REFRESH_TOKEN_TYPE_MISMATCH',
} as const;