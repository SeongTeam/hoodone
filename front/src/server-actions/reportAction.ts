'use server';

import { validateAuth } from '@/lib/server-only/authLib';
import { responseData } from '@/type/server-action/responseType';
import logger from '@/utils/log/logger';

const backendURL = process.env.BACKEND_URL;

export async function sendReport(formData: FormData, editPostId?: number) {
    const ret: responseData = { ok: false, message: '', response: {} };

    const reportEnum = formData.get('reportEnum');
    const content = formData.get('content');
    const target = formData.get('target');
    const id = formData.get('id');

    console.log(target);
    const accessToken = await validateAuth();

    try {
        const res = await fetch(`${backendURL}/reports/send`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                reportEnum: reportEnum,
                content: content,
                target: target,
                id: id,
            }),
        });

        if (res.ok) {
            const responseData = await res.json();

            console.log(` ddddd${responseData}`);

            ret.ok = true;

            ret.response = { detail: responseData };

            return ret;
        } else {
            ret.ok = false;
            ret.message = 'send report fail ';
            const data = await res.json();
            const { detail, statusCode, timestamp } = data;
            ret.response = data;

            return ret;
        }
    } catch (error) {
        logger.error('sendReport error', { message: error });
        throw new Error('sendReport error');
    }
}
