export class AuthApiResponseDto {
  postTokenAccess?: string;

  postTokenRefresh?: string;

  postSignup?: {
    refreshToken: string;
    accessToken: string;
  };

  postLoginEmail?: {
    refreshToken: string;
    accessToken: string;
  };
}
