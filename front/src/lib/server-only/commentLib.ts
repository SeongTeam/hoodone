import 'server-only';
import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from 'hoodone-shared';
import { CommentType } from '@/atoms/commen';
import assert from 'assert';

const backendURL = process.env.BACKEND_URL;

function getConfigConst() {
    const initialRootCommentID = 0;
    const depthLimit = 3;
    const initialDepth = 0;
    const replyDepthLimit = 5;

    return { initialRootCommentID, depthLimit, initialDepth, replyDepthLimit };
}

export const getCommentByID = async (postID: number, commentID: number) => {
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

const getCommenWithRange = async (postID: number, offset: number, limit: number) => {
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

/*TODO
- Reply Comment Cache revalidate 로직 구현하기
*/
const getReplyComment = async (PostID: number, commentID: number, limit: number) => {
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

export const getCommentsWithReply = async (PostID: number, commentID: number) => {
    const { replyDepthLimit } = getConfigConst();
    const commentPromise = getCommentByID(PostID, commentID);
    const replyCommentsPromise = getReplyComment(PostID, commentID, replyDepthLimit);

    const [comment, replyComments] = await Promise.all([commentPromise, replyCommentsPromise]);

    if (!comment) {
        throw new Error('comment not found');
    }

    if (!replyComments) {
        throw new Error('replyComments not found');
    }

    comment.replyComments = replyComments;

    return comment;
};

export const getInitialComments = async (postID: number) => {
    const { depthLimit } = getConfigConst();
    const initialOffset = 0;
    const comments = await getCommenWithRange(postID, initialOffset, depthLimit);
    return comments;
};

export const isLeafCommentOfPage = (componentDepth: number, commentDepth: number) => {
    const { depthLimit, replyDepthLimit } = getConfigConst();

    if (componentDepth === commentDepth) {
        //path is '/post/[postid]'
        return componentDepth % depthLimit !== depthLimit - 1;
    } else {
        //path is '/post/[postid]/comment/[commentid]'
        return componentDepth % replyDepthLimit !== replyDepthLimit - 1;
    }
};

export function getCommentListConfig() {
    const rootComponentDepth = 0;

    return { rootComponentDepth };
}
