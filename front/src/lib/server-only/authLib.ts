import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import base64, { decode } from 'js-base64';
import { AuthApiResponseDto } from '@/sharedModule/response-dto/auth-api-response.dto';
import { Asset } from 'next/font/google';
import assert from 'assert';
import { cookies } from 'next/headers';
import logger from '@/utils/log/logger';
import { LoggableResponse } from '@/utils/log/types';

const backURL = process.env.BACKEND_URL;

export async function renewAccessToken(refreshToken: string) {
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

export function checkAccessToken(accessToken: string, refreshToken: string) {
    const payload = accessToken.split('.')[1];
    const decodedPayload = decode(payload);
    const payloadObject = JSON.parse(decodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payloadObject.exp < now) {
        return renewAccessToken(refreshToken);
    }
    return accessToken;
}

export async function validateAuth() {
    const accessToken = cookies().get('accessToken')?.value;
    const refreshToken = cookies().get('refreshToken')?.value;
    let _token = '';

    if (!accessToken && refreshToken) {
        _token = await renewAccessToken(refreshToken);
    } else if (accessToken && refreshToken && typeof accessToken == 'string') {
        _token = await checkAccessToken(accessToken, refreshToken);
    }

    if (!_token) {
        logger.info(
            `[validateAuth] _token is not valid : ${_token}. accessToken : ${accessToken} / refreshToken : ${refreshToken}`,
        );
        throw new Error('access token and refresh token is not invalid');
    }

    setAccessTokenCookie(_token);
    return _token;
}

export function setAccessTokenCookie(accessToken: string) {
    cookies().set({
        name: 'accessToken',
        value: accessToken,
        maxAge: 60 * 10,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
}

export function setRefreshTokenCookie(refreshToken: string) {
    cookies().set({
        name: 'refreshToken',
        value: refreshToken,
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
}

export async function getUserBasicInfo() {
    try {
        const accessToken = await validateAuth();
        const response: Response = await fetch(`${backURL}/auth/identify`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            logger.error('[getUserBasicInfo] response is not ok', {
                response: new LoggableResponse(response),
            });
            throw new Error('getUserBasicInfo response error');
        }

        const res: AuthApiResponseDto = await response.json();
        const ret = res.identify!;

        return ret;
    } catch (e) {
        logger.error('getUserBasicInfo error', { message: e });
        throw new Error('getUserBasicInfo error');
    }
}
