import { atom } from "recoil";

export type PostType = {
  id?: string;
  creatorEmail: string;
  creatorDisplayName: string;
  title: string;
  content: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  createdAt: string;
  modifiedAt: string;
  linkedPostURL?: string;
};

export type PostVoteType = {
  id: string;
  postId: string;
  voteValue: number;
};

interface PostState {
  selectedPost: PostType | null;
  posts: PostType[];
  postVotes: PostVoteType[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostState>({
  key: "PostState",
  default: defaultPostState,
});
