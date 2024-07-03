export class AuthApiResponseDto {
    postTokenAccess?: string;

    postTokenRefresh?: string;

    postSignup?: {
        email: string;
        nickname: string;
    };

    postLoginEmail?: {
        nickname: string;
        refreshToken: string;
        accessToken: string;
    };

    //   postSendPinCode 는 이런 형식으로 return response: '250 2.0.0 OK  1716551382 d2e1a72fcca58-6f8fcbea886sm952420b3a.137 - gsmtp',
    sendSignUpPinCode?: string;

    sendPasswordResetLink?: string;

    getCompareTempUserPinCode?: {
        statusCode: Number;
        message: string;
        result: boolean;
    };

    resetPassword?: {
        generatedMaps: [];
        raw: [];
        affected: 1;
    };

    identify?: {
        nickname: string;
        email: string;
        profileImagePublicId: string;
    };
}
