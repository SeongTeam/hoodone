import { atom } from "recoil";

type authorType = {
  email: string;
  nickname: string;
  profileImg: string;
};

type commentType = {};
export type PostType = {
  id?: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isPublished: boolean;
  author: authorType;
  commentList: object[];
  thumbnailPublicID?: string;
  linkedPostURL?: string;
  publicID?: string;
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
  key: "PostState",
  default: defaultPostState,
});
