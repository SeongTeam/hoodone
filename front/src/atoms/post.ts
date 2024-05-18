import { atom } from 'recoil';

type authorType = {
    email: string;
    nickname: string;
    profileImg: string;
};

type commentType = {};
export type PostType = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
    isPublished: boolean;
    author: authorType;
    commentID: number;
    thumbnailPublicID?: string;
    thumbnailURL?: string;
    linkedPostURL?: string;
};

export type PostLikeType = {
    id: string;
    postId: string;
    voteValue: number;
};

interface PostState {
    selectedPost: PostType | null;
    posts: PostType[];
    postLikes: PostLikeType[];
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postLikes: [],
};

export const postState = atom<PostState>({
    key: 'PostState',
    default: defaultPostState,
});
