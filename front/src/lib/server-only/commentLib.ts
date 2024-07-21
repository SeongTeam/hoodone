import 'server-only';
import logger from '@/utils/log/logger';
import { CommentApiResponseDto } from '@/sharedModule/response-dto/comment-api-response.dto';
import { CommentType } from '@/type/commentType';
import assert from 'assert';
import { POST_TYPE } from '@/components/posts/postType';
import { LoggableResponse } from '@/utils/log/types';

namespace CommentCache {
    /*TODO
    - Change Comment Tag logic from revalidate path to revalidate tag
        - To implement this,Maybe comment fetch logic is need to change.  
    */
    enum COMMENT_CACHE_TAG {
        QUEST = 'Quest',
        SB = 'Submission',
        RANGE = 'RANGE',
        OFFSET = 'Offset',
        ID = 'ByID',
    }
}

export class CommentFetchService {
    type: POST_TYPE;
    rootComponentDepth = 0;
    private BackendPath: string;
    private initialRootCommentID = 0;
    private depthLimit = 3;
    private initialDepth = 0;
    private replyDepthLimit = 5;
    private backendURL = `${process.env.BACKEND_URL}/posts`;
    constructor(type: POST_TYPE) {
        this.type = type;
        switch (type) {
            case POST_TYPE.QUEST:
                this.BackendPath = `${this.backendURL}/quest:`;
                break;
            case POST_TYPE.SB:
                this.BackendPath = `${this.backendURL}/sb:`;
                break;
            default:
                logger.error('Construct PostInfo error. Invalid post type', {
                    message: { type },
                });
                throw new Error('Invalid post type');
                break;
        }
    }
    public async getCommentByID(postID: number, commentID: number) {
        try {
            const res = await fetch(`${this.BackendPath}${postID}/comments/${commentID}`);
            if (!res.ok) {
                const logResponse = new LoggableResponse(res);
                logger.error('getCommentByID response error', {
                    Response: logResponse,
                    message: `type : ${this.type}, postID: ${postID}, commentID: ${commentID}`,
                });
                throw new Error('getCommentByID response error');
            }
            const data: CommentApiResponseDto = await res.json();

            return data.getById as CommentType;
        } catch (error) {
            logger.error('getCommentByID error', { message: error }, { postID, commentID });
            return null;
        }
    }

    public async getCommenWithRange(postID: number, offset: number, limit: number) {
        try {
            const res = await fetch(
                `${this.BackendPath}${postID}/comments/range?depthBegin=${offset}&depthEnd=${
                    offset + limit - 1
                }`,
            );
            if (!res.ok) {
                const resLog = new LoggableResponse(res);
                logger.error('getCommenWithRange response error', {
                    Response: resLog,
                    message: `type : ${this.type}, postID: ${postID}, offset: ${offset}, limit: ${limit}`,
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
    }

    /*TODO
    - Reply Comment Cache revalidate 로직 구현하기
    */

    public async getCommentsWithReply(postID: number, commentID: number) {
        const commentPromise = this.getCommentByID(postID, commentID);
        const replyCommentsPromise = this.getReplyComment(postID, commentID, this.replyDepthLimit);

        const [comment, replyComments] = await Promise.all([commentPromise, replyCommentsPromise]);

        if (!comment) {
            logger.error('[getCommentsWithReply] comment not found', {
                message: `postID: ${postID}, commentID: ${commentID},
                comment : ${JSON.stringify(comment)}`,
            });
            throw new Error('[getCommentsWithReply] comment not found');
        }

        if (!replyComments) {
            logger.error('[getCommentsWithReply] repltyComments not found', {
                message: `postID: ${postID}, commentID: ${commentID},
                comment : ${JSON.stringify(replyComments)}`,
            });
            throw new Error('[getCommentsWithReply] replyComments not found');
        }

        comment.replyComments = replyComments;

        return comment;
    }
    public async getInitialComments(postType: POST_TYPE, postID: number) {
        const initialOffset = 0;
        const comments = await this.getCommenWithRange(postID, initialOffset, this.depthLimit);
        return comments;
    }
    public isLeafCommentOfPage(componentDepth: number, commentDepth: number) {
        const commentPageDepthLimit = this.replyDepthLimit + 1;

        if (componentDepth === commentDepth) {
            //page is Quest or Submission
            return componentDepth % this.depthLimit !== this.depthLimit - 1;
        } else {
            //page is 'comment/[commentid]' of Quest or Submission
            return componentDepth % commentPageDepthLimit !== commentPageDepthLimit - 1;
        }
    }
    async getReplyComment(PostID: number, commentID: number, limit: number) {
        try {
            const res = await fetch(
                `${this.BackendPath}${PostID}/comments/reply?commentId=${commentID}&limit=${limit}`,
            );
            if (!res.ok) {
                const resLog = new LoggableResponse(res);
                logger.error('getReplyComment response error', {
                    Response: resLog,
                    message: `type : ${this.type}, PostID: ${PostID}, commentID: ${commentID}, limit: ${limit}`,
                });
                throw new Error('getReplyComment response error');
            }
            const data: CommentApiResponseDto = await res.json();
            const commentList = data.getReplyComments as CommentType[];
            return commentList;
        } catch (e) {
            logger.error('getReplyComment error', { message: e }, { PostID, commentID, limit });
            return null;
        }
    }
}
