import { atom } from 'recoil';
import { PostState } from '@/type/postType';

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
};

export const postState = atom<PostState>({
    key: 'PostState',
    default: defaultPostState,
});
