import logger from '@/utils/log/logger';
import { NextRequest, NextResponse } from 'next/server';

const backURL = process.env.BACKEND_URL;

export async function GET(req: NextRequest, email: string) {
    // const res = await fetch(
    //     `/api/accounts/${accountId}/connections/${connectionId}`,
    //     {
    //       method: 'GET',
    //       headers: {
    //         'content-type': 'application/json',
    //       },
    //     }
    //   );
    // console.log(`email => ${email}`);
    logger.info(`email => ${email}`);
    const data = await req.json();

    const res = await fetch(`${backURL}/users/email:${data.email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //     nickname,
        //     email,
        //     password,
        // }),
        next: { revalidate: 60 }, // R
    });

    const result = res.json();

    return NextResponse.json({
        body: {
            title: 'get user data successful ',
            status: res.status,
            data: result,
        },
    });
}
