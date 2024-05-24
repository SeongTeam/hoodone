'use server';

import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { AuthApiResponseDto } from 'hoodone-shared';
import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const backURL = process.env.BACKEND_URL;

type responseData = {
    ok: boolean;
    message: string;
    response?: any;
};

/*TODO
- Authorization 로직 확장하기
    다음 문서 참조 : https://nextjs.org/docs/app/building-your-application/authentication#authorization
- backend응답으로 받은 accessToken과 resfreshToken 반환 후, 처리할 로직 구현하기.
*/

export async function signUp(formData: FormData) {
    const ret: responseData = { ok: false, message: '' };
    try {
        // TODO) formData 값 최소한으로 줄일 는 코드 찾아보기 3줄 오바
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const nickname = formData.get('password') as string;

        const res = await fetch(`${backURL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname,
                email,
                password,
            }),
        });
        console.log(res);
        if (res.ok) {
            ret.ok = true;
            ret.response = await res.json();

            return ret;
        } else {
            ret.ok = false;
            ret.message = 'signUp fail ';
            const data = await res.json();
            const { detail, statusCode, timestamp } = data;
            ret.response = { detail, statusCode, timestamp };

            return ret;
        }
    } catch (e) {
        ret.message = `Authenication failed Because of Internal Server error.`;
        ret.response = e;
        return ret;
    }
}

export async function signIn(formData: FormData) {
    const ret: responseData = { ok: false, message: '' };
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        // throw '1234';

        const basicAuthToken = `${email}:${password}`;

        const res = await fetch(`${backURL}/auth/login/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(basicAuthToken)}`,
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (res.ok) {
            const responseData: AuthApiResponseDto = await res.json();
            logger.info('Backend Response', { message: responseData });

            const { accessToken, refreshToken } = responseData.postLoginEmail!;

            cookies().set({
                name: 'accessToken',
                value: accessToken,
                maxAge: 60 * 10,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            cookies().set({
                name: 'refreshToken',
                value: refreshToken,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });

            ret.ok = true;
        } else {
            const data = await res.json();
            logger.error('Backend Error', {
                message: `Email : ${email}, ${JSON.stringify(data)}`,
            });
            ret.message = `Authenication failed. please check email and password`;
        }

        return ret;
    } catch (error) {
        logger.error(`[${signIn.name}]Server Action Error`, { message: error });
        ret.message = `Authenication failed Because of Internal Server error.`;
        return ret;
    }
}

export async function signOut() {
    cookies().delete('accessToken');
    cookies().delete('refreshToken');
}

export async function serverActionTest(formData: FormData) {
    cookies().set({
        name: 'test',
        value: `test111`,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
}
