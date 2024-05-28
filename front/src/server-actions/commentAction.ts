'use server';

import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from 'hoodone-shared';
import { CommentType } from '@/atoms/commen';
import { assert } from 'console';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const backendURL = process.env.BACKEND_URL;

export async function leaveComment(formData: FormData, postID: number) {
    const content = formData.get('content') as string;
    const body = { content };
    const accessToken = cookies().get('accessToken')?.value;

    if (!accessToken) {
        throw new Error('accessToken is not exist');
    }

    try {
        const res = await fetch(`${backendURL}/posts/${postID}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            logger.error('leaveComment response error', {
                message: `target post: ${postID}, response :${JSON.stringify(res.body)}, status : ${
                    res.status
                }`,
            });
            throw new Error('leaveComment response error');
        }

        const data: CommentApiResponseDto = await res.json();
        const comment = data.post as CommentType;
        revalidateTag(`commentOnpost-${postID}`);
        return comment;
    } catch (error) {
        logger.error('leaveComment error', { message: error });
        return null;
    }
}

/*TODO
- Reply Depth를 기반으로 revalidate를 위한 태그 구현하기
*/
export async function leaveReply(formData: FormData, postID: number, responseToId: number) {
    const content = formData.get('content') as string;

    const body = { content, responseToId };
    const accessToken = cookies().get('accessToken')?.value;

    if (!accessToken) {
        throw new Error('accessToken is not exist');
    }

    try {
        const res = await fetch(`${backendURL}/posts/${postID}/comments/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            logger.error('leaveReply response error', {
                message: `target post: ${postID}, response :${JSON.stringify(res.body)}, status : ${
                    res.status
                }`,
            });
            throw new Error('leaveReply response error');
        }

        const data: CommentApiResponseDto = await res.json();
        const comment = data.postReply as CommentType;
        revalidateTag(`commentOnpost-${postID}`);
        return comment;
    } catch (error) {
        logger.error('leaveReply error', { message: error });
        return null;
    }
}
