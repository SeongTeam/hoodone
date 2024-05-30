import { init } from 'next/dist/compiled/webpack/webpack';
import { PostType, AuthorType } from './post';

export type CommentType = {
    id: number;
    author: AuthorType;
    content: string;
    post: PostType;
    updatedAt: Date;
    createdAt: Date;
    likeCount: number;
    responseToId: number;
    replyCommentIds: number[];
    replyComments: CommentType[];
    depth: number;
};

interface CommentState {
    comment: CommentType;
    status: 'showing' | 'deleted' | 'texting';
    replyCommentStatus: 'showing' | 'hiding';
}

export class CommentClass {
    constructor(comment: CommentType) {
        this.comment = comment;
    }
    comment: CommentType;

    getComment() {
        return this.comment;
    }

    isHaveReply() {
        return this.comment.replyCommentIds.length > 0;
    }

    isAccessableReply() {
        return this.comment.replyComments && this.comment.replyComments.length > 0;
    }
}
