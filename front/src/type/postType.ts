export type AuthorType = {
    nickname: string;
    profileImagePublicId: string;
};

export type PostType = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    title: string;
    content: string;
    cloudinaryPublicId?: string;
    tags: string[];
    favoriteCount: number;
    isPublished: boolean;
    boardId: number;
    author: AuthorType;
    comments: string[];
};

export interface PostState {
    selectedPost: PostType | null;
    posts: PostType[];
}

export interface QuestInterface extends PostType {
    sbPosts: string[];
}

export interface SubmissionInterface extends PostType {
    parentPost: string;
}

export type NewPostFormType = {
    title: string;
    content: string;
    tags: string[];
    type: POST_TYPE;
};

export enum NEW_POST_FORMAT {
    POST_DTO = 'postDto',
    IMAGE = 'image',
}

export enum POST_TYPE {
    QUEST = 'quest',
    SB = 'submission',
}
export const tagDelimiter = ' ';
