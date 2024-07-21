'use server';

import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from '@/sharedModule/response-dto/comment-api-response.dto';
import { CommentType } from '@/type/commentType';
import { assert } from 'console';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { checkAccessToken } from '@/lib/server-only/authLib';
import { validateAuth } from '@/lib/server-only/authLib';
import { LoggableResponse } from '@/utils/log/types';
import { POST_TYPE } from '@/components/posts/postType';

const backendURL = process.env.BACKEND_URL;

export async function leaveComment(
    formData: FormData,
    postType: POST_TYPE,
    postID: number,
    frontPath: string,
) {
    const content = formData.get('content') as string;
    const body = { content };
    const backebdPath = getBackEndPath(postType, postID);

    try {
        const accessToken = await validateAuth();

        const res = await fetch(`${backebdPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const logRes = new LoggableResponse(res);
            logger.error('leaveComment response error', {
                response: logRes,
                message: `target post: ${postID}, body : ${JSON.stringify(body)} 
                }`,
            });
            throw new Error('leaveComment response error');
        }

        const data: CommentApiResponseDto = await res.json();
        const comment = data.post as CommentType;
        revalidatePath(`${frontPath}`);
        return comment;
    } catch (error) {
        logger.error('leaveComment error', { message: error });
        return null;
    }
}

export async function leaveReply(
    formData: FormData,
    postType: POST_TYPE,
    postID: number,
    responseToId: number,
    frontPath: string,
) {
    const content = formData.get('content') as string;
    const body = { content, responseToId };

    const backebdPath = getBackEndPath(postType, postID);

    try {
        const accessToken = await validateAuth();
        const res = await fetch(`${backebdPath}/reply`, {
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
        revalidatePath(frontPath);
        return comment;
    } catch (error) {
        logger.error('leaveReply error', { message: error });
        return null;
    }
}

export async function deleteComment(
    postType: POST_TYPE,
    postID: number,
    commentID: number,
    frontPath: string,
) {
    const backebdPath = getBackEndPath(postType, postID);
    try {
        const accessToken = await validateAuth();
        const res = await fetch(`${backebdPath}/${commentID}`, {
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

        revalidatePath(frontPath);

        return commentID;
    } catch (error) {
        logger.error('deleteComment error', { message: error });
        return null;
    }
}

function getBackEndPath(postType: POST_TYPE, postID: number) {
    switch (postType) {
        case POST_TYPE.QUEST:
            return `${backendURL}/posts/quest:${postID}/comments`;
        case POST_TYPE.SB:
            return `${backendURL}/posts/sb:${postID}/comments`;
        default:
            logger.error('[getBackEndPath] Invalid post type error :', postType);
            throw new Error('[getBackEndPath] Invalid post type');
            break;
    }
}
