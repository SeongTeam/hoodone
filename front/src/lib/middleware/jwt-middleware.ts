import { NextRequest, NextResponse } from 'next/server';
import { renewAccessToken, checkAccessToken } from '../server-only/authLib';

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
