import { NextRequest } from 'next/server';

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
    console.log(`email => ${email}`);

    const res = await fetch(`${backURL}/users/email/${email}`, {
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
}
