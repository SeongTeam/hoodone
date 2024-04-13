export class AuthApiResponseDto {
  postTokenAccess?: string;

  postTokenRefresh?: string;

  postSignup?: {
    email: string;
    nickname: string;
  };

  postLoginEmail?: {
    refreshToken: string;
    accessToken: string;
  };
}
