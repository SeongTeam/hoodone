import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { AuthApiResponseDto } from 'hoodone-shared';

const backURL = process.env.BACKEND_URL;
/*TODO
- components/modal/auth/signUp.tsx 포함한 이메일 인증 및 계정 생성 로직 구현
*/
export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, pinCode, password } = data;

        logger.info('register PATCH route.ts', {
            message: `PATCH reset-password 호출 성공 ${pinCode}`,
        });

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

            return NextResponse.json({
                ok: true,
                body: {
                    title: 'Reset  password successful ',
                    status: response.status,
                    data: { message: responseData.resetPassword },
                },
            });
        } else {
        }
    } catch (error) {
        console.log(error);
    }
}
