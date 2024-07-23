export type AuthorType = {
    nickname: string;
    profileImagePublicId: string;
};

interface BasePost {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    title: string;
    content: string;
    cloudinaryPublicId: string;
    tags: string[];
    favoriteCount: number;
    isPublished: boolean;
    boardId: number;
    author: AuthorType;
    comments: string[];
}

export interface QuestPost extends BasePost {
    sbPosts: string[];
    type: POST_TYPE.QUEST;
}

export interface SubmissionPost extends BasePost {
    parentPost: QuestPost;
    voteResult: VoteResult;
    type: POST_TYPE.SB;
}

export interface PostContainer<T extends BasePost> {
    postData: T;
    paginatedOffset: number;
    lastFetched: Date;
}

export interface NewPostForm {
    title: string;
    content: string;
    tags: string[];
    type: POST_TYPE;
    cloudinaryPublicId?: string;
    parentQuestId?: string;
}

export enum NEW_POST_FORMAT {
    POST_DTO = 'postDto',
    IMAGE = 'image',
}

export type POST_TYPE_MAP = {
    [POST_TYPE.QUEST]: QuestPost;
    [POST_TYPE.SB]: SubmissionPost;
};

export enum POST_TYPE {
    QUEST = 'quest',
    SB = 'submission',
}
export const tagDelimiter = ' ';

export enum VoteResult {
    NOT_YET,
    APPROVAL,
    DISAPPROVAL,
}
