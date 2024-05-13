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

        const res: Response = await fetch(`${backURL}/auth/signup`, {
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

        if (res.ok) {
            const { email, nickname } = await res.json();

            logger.info('Backend Response', { message: email + '-' + nickname });
            return NextResponse.json({
                body: {
                    title: 'SignUp successful ',
                    status: res.status,
                    data: { nickname: nickname, email: email },
                },
            });
        } else {
            const errorData = await res.json();
            const body = res.body;
            const { message, error, errorCode, detail } = errorData; // err일때 사용하는 프로퍼티 정해서 return 하자
            logger.error('elsee Backend Error', {
                message: `${detail.message}/MSG + [${detail.error}] ${error}`,
            });
            // TransactionInterceptor에서 .error에 집어 넣은 메세지가 error에 담겨 졌다.
            logger.error('elsee Backend Error response =>', { reponse: `${detail}` });

            // body는 담기지 않고 error는 담기고 있다. => error라는 프로퍼티를 이용해서 Exception message를 사용하자
            return NextResponse.json(
                {
                    error: `Sign up failed - ${detail.error}`,
                    message: detail.message,
                    pst: detail.pst,
                }, // signUp.tsx에서 error의 있는 string을 읽는것이 필수
                { status: res.status },
            );
        }
    } catch (error: any) {
        logger.error('catch err Internal Server Error', { message: error });

        return NextResponse.json(
            { error: 'Sign up failed. please check email and password', message: error },
            { status: 500 },
        );
    }
}
