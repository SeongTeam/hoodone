'use server';

import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from 'hoodone-shared';
import { CommentType } from '@/atoms/commen';
import { assert } from 'console';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { checkAccessToken } from '@/lib/server-only/authLib';
import { validateAuth } from '@/lib/server-only/authLib';

const backendURL = process.env.BACKEND_URL;

export async function leaveComment(formData: FormData, postID: number, path: string) {
    const content = formData.get('content') as string;
    const body = { content };

    try {
        const accessToken = await validateAuth();

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
        revalidatePath(path);
        return comment;
    } catch (error) {
        logger.error('leaveComment error', { message: error });
        return null;
    }
}

export async function leaveReply(
    formData: FormData,
    postID: number,
    responseToId: number,
    path: string,
) {
    const content = formData.get('content') as string;

    const body = { content, responseToId };

    try {
        const accessToken = await validateAuth();
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
        revalidatePath(path);
        return comment;
    } catch (error) {
        logger.error('leaveReply error', { message: error });
        return null;
    }
}

export async function deleteComment(postID: number, commentID: number, path: string) {
    const accessToken = cookies().get('accessToken')?.value;

    if (!accessToken) {
        throw new Error('accessToken is not exist');
    }

    try {
        const res = await fetch(`${backendURL}/posts/${postID}/comments/${commentID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) {
            logger.error('deleteComment response error', {
                message: `target post: ${postID}, response :${JSON.stringify(res.body)}, status : ${
                    res.status
                }`,
            });
            throw new Error('deleteComment response error');
        }

        revalidatePath(path);

        return commentID;
    } catch (error) {
        logger.error('deleteComment error', { message: error });
        return null;
    }
}
