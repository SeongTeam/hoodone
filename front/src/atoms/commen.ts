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
};

interface CommentState {
    comment: CommentType;
    status: 'showing' | 'deleted' | 'texting';
    replyCommentStatus: 'showing' | 'hiding';
}
