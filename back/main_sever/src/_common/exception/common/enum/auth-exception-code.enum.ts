export const AuthExceptionEnum = {
    // 회원가입 관련
    ACCOUNT_CREATION_FAILED: 40000,
    EMAIL_EXISTS: 40001,
    NICKNAME_EXISTS: 40002,

    // 로그인 관
    LOGIN_FAILED: 40010,
    EMAIL_NOT_FOUND: 40011,
    INCORRECT_PASSWORD: 40012,

    //JWT 관련
    JWT_NOT_FOUND_TOKEN: 40101,
    JWT_INVALID_TOKEN_OR_NO_BEARER_BASIC: 40102,
    JWT_TOKEN_FORMAT_ERROR: 40103,
    JWT_INVALID_TOKEN: 40104,
    JWT_EXPIRED: 40105,

    ACCESS_TOKEN_ERROR: 40120,
    ACCESS_TOKEN_TYPE_MISMATCH: 40121,
    REFRESH_TOKEN_ERROR: 40140,
    REFRESH_TOKEN_TYPE_MISMATCH: 40121,

    //인증 관련
    AUTHENTICATION_REQUIRED: 40200, // Authentication is required but missing
    AUTHENTICATION_FAILED: 40201, // Generic authentication failure
    ACCOUNT_LOCKED: 40202, // Account locked due to multiple failed login attempts
    ACCOUNT_DISABLED: 40203, // Account has been disabled by an administrator
    PASSWORD_EXPIRED: 40205, // Password has expired and must be changed

    // 권한 관련
    AUTHORIZATION_REQUIRED: 40300, // Authorization is required for this action
    INSUFFICIENT_PERMISSIONS: 40301, // User has insufficient permissions to access a resource
    ROLE_NOT_ALLOWED: 40302, // User's role does not allow access to a specific action
    FORBIDDEN_RESOURCE_ACCESS: 40303, // Access to a resource is forbidden
    INVALID_AUTHORIZATION_HEADER: 40304, // The authorization header format is invalid
    UNAUTHORIZED_ACCESS: 40305, // Unauthorized access attempt detected

    // 심각한 에러 관련
    CREDENTIALS_REVOKED: 40400, // Token or credentials have been revoked (e.g., due to logout)
    JWT_LOGIC_ERROR: 40401,
} as const;
