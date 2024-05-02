import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { AuthApiResponseDto } from 'hoodone-shared';
import { type NextRequest } from 'next/server';

const backURL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { nickname, email, password } = data;

        logger.info('SignUp POST route.ts', {
            message: `POST signUP 호출 성공 ${nickname + email + password}`,
        });

        const response: Response = await fetch(`${backURL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname,
                email,
                password,
            }),
            next: { revalidate: 60 }, // R
        });

        if (response.ok) {
            const responseData: AuthApiResponseDto = await response.json();
            logger.info('Backend Response', { message: response.text() });

            const { email, nickname } = responseData.postSignup!;
            return NextResponse.json({
                body: {
                    title: 'SignUp successful ',
                    status: response.status,
                    data: { nickname: nickname, email: email },
                },
            });
        } else {
            logger.error('elsee Backend Error', { message: `${(await response.json()).response}` });
            return NextResponse.json({ error: 'Sign up failed' }, { status: 500 });
        }
    } catch (error) {
        logger.error('catch err Internal Server Error', { message: error });

        return NextResponse.json(
            { error: 'Signout failed. please check email and password', message: error },
            { status: 200 },
        );
    }
}
