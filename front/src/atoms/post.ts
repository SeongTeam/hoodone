import { atom } from 'recoil';

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

interface PostState {
    selectedPost: PostType | null;
    posts: PostType[];
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
};

export const postState = atom<PostState>({
    key: 'PostState',
    default: defaultPostState,
});

export interface QuestInterface extends PostType {
    sbPosts: string[];
}

export interface SubmissionInterface extends PostType {
    parentPost: string;
}
