import { NextRequest, NextResponse } from 'next/server';
import base64, { decode } from 'js-base64';
import { AuthApiResponseDto } from 'hoodone-shared';

const backURL = process.env.BACKEND_URL;

async function renewAccessToken(refreshToken: string) {
    if (!refreshToken) return '';

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
    console.log('refresh token is not invalid token or not exist');
    return '';
}

function checkAccessToken(accessToken: string, refreshToken: string) {
    const payload = accessToken.split('.')[1];
    const decodedPayload = decode(payload);
    const payloadObject = JSON.parse(decodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payloadObject.exp < now) {
        return renewAccessToken(refreshToken);
    }
    return accessToken;
}

const jwtMiddleware = async (request: NextRequest) => {
    let _token: string = '';
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const headers = new Headers(request.headers);
    const resp = NextResponse.next({
        request: {
            headers,
        },
    });

    if (!accessToken && refreshToken) {
        _token = await renewAccessToken(refreshToken);
    }

    if (accessToken && refreshToken && typeof accessToken == 'string') {
        _token = await checkAccessToken(accessToken, refreshToken);
    }
    resp.headers.set('accessToken', _token);
    resp.cookies.set('accessToken', _token);

    return resp;
};

export default jwtMiddleware;
