'use server';

import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { AuthApiResponseDto } from '@/sharedModule/response-dto/auth-api-response.dto';
import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { extractStatusMessage } from '@/lib/server-only/message';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/lib/server-only/authLib';
import { type responseData } from '@/type/server-action/responseType';
import { type SignInDTO } from '@/type/server-action/AuthType';
const backURL = process.env.BACKEND_URL;

/*TODO
- Authorization 로직 확장하기
    다음 문서 참조 : https://nextjs.org/docs/app/building-your-application/authentication#authorization
- backend응답으로 받은 accessToken과 resfreshToken 반환 후, 처리할 로직 구현하기.
*/

export async function signUp(formData: FormData) {
    const ret: responseData = { ok: false, message: '', response: {} };
    try {
        // TODO) formData 값 최소한으로 줄일 는 코드 찾아보기 3줄 오바
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const nickname = formData.get('nickname') as string;

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
            console.log('ddddd');

            console.log(data);
            ret.response = { detail, statusCode, timestamp };

            return ret;
        }
    } catch (e) {
        ret.message = `Authenication failed Because of Internal Server error.`;
        ret.response = { e };
        console.log('signUp error');
        return ret;
    }
}

export async function signIn(formData: FormData) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: { nickname: '' } as SignInDTO,
    };
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

            const { nickname, accessToken, refreshToken, favoriteQuests } =
                responseData.postLoginEmail!;

            setAccessTokenCookie(accessToken);
            setRefreshTokenCookie(refreshToken);
            ret.response = { nickname, favoriteQuests } as SignInDTO;
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

export async function requestCertifiedMail(toEmail: string) {
    const ret: responseData = { ok: false, message: '', response: {} };
    try {
        const res = await fetch(`${backURL}/auth/send-pin-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toEmail,
            }),
        });

        if (res.ok) {
            const responseData: AuthApiResponseDto = await res.json();

            console.log(responseData);

            const message = responseData.sendSignUpPinCode ?? '';
            if (extractStatusMessage(message)) {
                ret.ok = true;
            }
            const detail = { message: message };
            ret.response = { detail };

            return ret;
        } else {
            ret.ok = false;
            ret.message = 'send email fail ';
            const data = await res.json();
            const { detail, statusCode, timestamp } = data;
            ret.response = data;

            return ret;
        }
    } catch (e) {
        ret.message = `Internal Server error.`;
        ret.response = { e };
        return ret;
    }
}

export async function comparePinCode(formData: FormData) {
    const ret: responseData = { ok: false, message: '', response: {} };
    const email = formData.get('email') as string;
    const pinCode = formData.get('pinCode') as string;

    try {
        const res = await fetch(`${backURL}/auth/compare/tempuser-pin-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                pinCode,
            }),
        });
        console.log(res);
        if (res.ok) {
            const responseData: AuthApiResponseDto = await res.json();
            const { result, statusCode, message } = responseData.getCompareTempUserPinCode!;

            ret.message = message;
            ret.response = statusCode;
            if (result) {
                ret.ok = true;
            }

            return ret;
        } else {
            ret.message = 'not match pin code ';
            const data = await res.json();
            const { detail, statusCode, timestamp } = data;
            ret.response = { detail, statusCode, timestamp };

            return ret;
        }
    } catch (e) {
        ret.message = `Internal Server error.`;
        ret.response = { e };
        return ret;
    }
}

export async function sendRegisterEmail(formData: FormData) {
    const ret: responseData = { ok: false, message: '', response: {} };
    const toEmail = formData.get('toEmail') as string;
    logger.info('register PATCH route.ts', {
        message: `PATCH resiter 호출 성공 ${toEmail}`,
    });
    try {
        const response: Response = await fetch(`${backURL}/auth/send-password-reset-link`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toEmail,
            }),
            next: { revalidate: 100 },
        });

        if (response.ok) {
            const res = await response.json();
            const responseData: AuthApiResponseDto = res;

            ret.ok = true;
            ret.response = { result: responseData.sendPasswordResetLink };
            return ret;
        } else {
        }
    } catch (e) {}
}

export async function resetPassword(formData: FormData) {
    const ret: responseData = { ok: false, message: '', response: {} };

    const email = formData.get('email') as string;
    const pinCode = formData.get('pinCode') as string;
    const password = formData.get('password') as string;

    try {
        const response: Response = await fetch(`${backURL}/auth/reset-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                pinCode,
                password,
            }),
            next: { revalidate: 100 },
        });

        const res = await response.json();

        if (response.ok) {
            const responseData: AuthApiResponseDto = res;

            ret.ok = true;
            ret.message = 'Reset  password successful';
            ret.response = { result: responseData.resetPassword };
            return ret;
        } else {
        }
    } catch (e) {
        console.log(e);
    }
}
