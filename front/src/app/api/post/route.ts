import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { AuthApiResponseDto, PostApiResponseDto } from 'hoodone-shared';
import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// const backURL = process.env.BACKEND_URL;
// TODO .env에 backURL 설정
const backURL = 'http://localhost:3000';

/*TODO
- backend응답으로 받은 accessToken과 resfreshToken 반환 후, 처리할 로직 구현하기.
*/
export async function GET(req: NextRequest) {
    try {
        const res = await fetch(`${backURL}/posts/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // TODO post 업데이트마다 revaildate event 실행
            next: { revalidate: 30 },
        });

        if (res.ok) {
            const responseData = await res.json();
            logger.info('Backend Response', { message: responseData });

            return NextResponse.json(responseData);
        } else {
            logger.error('Backend Error', { message: `HTTP ${res.status}` });
            return NextResponse.json(
                { error: 'Authenication failed. please check email and password' },
                { status: res.status },
            );
        }

        //return NextResponse.json({ email, password, message: "Hello, Next.js!" });
    } catch (error) {
        logger.error('Internal Server Error', { message: error });
        return NextResponse.json({ error: `Internal Server Error ${error}` }, { status: 500 });
    }
}
