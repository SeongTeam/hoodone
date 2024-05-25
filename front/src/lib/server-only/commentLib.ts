import 'server-only';
import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from 'hoodone-shared';
import { CommentType } from '@/atoms/commen';
import assert from 'assert';

const backendURL = process.env.BACKEND_URL;

export const getCommentByID = async (postID: string, commentID: string) => {
    try {
        const res = await fetch(`${backendURL}/posts/${postID}/comments/${commentID}`);
        if (!res.ok) {
            logger.error('getCommentByID response error', { message: JSON.stringify(res.body) });
            throw new Error('getCommentByID response error');
        }
        const data: CommentApiResponseDto = await res.json();

        return data.getById as CommentType;
    } catch (error) {
        logger.error('getCommentByID error', { message: error }, { postID, commentID });
        return null;
    }
};

export const getCommenWithRange = async (postID: number, offset: number, limit: number) => {
    try {
        const res = await fetch(
            `${backendURL}/posts/${postID}/comments/range?depthBegin=${offset}&depthEnd=${
                offset + limit - 1
            }`,
            { next: { tags: [`commentOnpost-${postID}`] } },
        );
        if (!res.ok) {
            logger.error('getCommenWithRange response error', {
                message: `response :${JSON.stringify(
                    res.body,
                )}, postID: ${postID}, offset: ${offset}, limit: ${limit}`,
            });
            throw new Error('getCommenWithRange response error');
        }
        const data: CommentApiResponseDto = await res.json();
        const commentList = data.getCommentsByRange as CommentType[];
        return commentList;
    } catch (e) {
        logger.error('getCommenWithRange error', { message: e }, { postID, offset, limit });
        return null;
    }
};

export const getReplyComment = async (PostID: number, commentID: number, limit: number) => {
    try {
        const res = await fetch(
            `${backendURL}/posts/${PostID}/comments/reply?commentId=${commentID}&limit=${limit}`,
        );
        if (!res.ok) {
            logger.error('getReplyComment response error', { message: JSON.stringify(res.body) });
            throw new Error('getReplyComment response error');
        }
        const data: CommentApiResponseDto = await res.json();
        const commentList = data.getReplyComments as CommentType[];
        return commentList;
    } catch (e) {
        logger.error('getReplyComment error', { message: e }, { PostID, commentID, limit });
        return null;
    }
};
