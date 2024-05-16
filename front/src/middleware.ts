import { NextRequest, NextResponse } from 'next/server';
import base64, { decode } from 'js-base64';
import { AuthApiResponseDto } from 'hoodone-shared';

const backURL = process.env.BACKEND_URL;

async function renewAccessToken(refreshToken: string) {
    if (refreshToken == null) return '';

    const res: Response = await fetch(`${backURL}/auth/token/access`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${refreshToken}`,
        },
    });

    if (res.ok) {
        const data: AuthApiResponseDto = await res.json();
        return data.postTokenAccess!;
    }
    return '';
}

function checkAccessToken(accessToken: string, refreshToken: string) {
    const payload = accessToken.split('.')[1];
    const decodedPayload = decode(payload);
    const payloadObject = JSON.parse(decodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payloadObject.exp < now) return renewAccessToken(refreshToken);
    return accessToken;
}

export async function middleware(request: NextRequest) {
    console.log(`_____middleware working_____`);
    const response = NextResponse.next();

    //TODO) 회원 인증이 필요한 서비스 path에서 불러 올 수 있도록
    if (request.nextUrl.pathname.startsWith('/api')) {
        console.log('call middleware - /sign_up');
        let accessTokenCookie = request.cookies.get('accessToken');
        let refreshTokenCookie = request.cookies.get('refreshToken');

        if (accessTokenCookie && refreshTokenCookie && typeof accessTokenCookie.value == 'string') {
            const accessToken = accessTokenCookie.value;
            const refreshToken = refreshTokenCookie.value;

            let result = await checkAccessToken(accessToken, refreshToken);
            console.log(result);

            response.cookies.set('accessToken', result);

            return response;
        }
    }

    return response;
}

export const config = {
    matcher: [`/api/auth/login/`, '/api/mock/post/'],
};
