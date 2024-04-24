import { atom } from "recoil";

export interface userAccountState {
  email: string; // identifier
  nickName: string;
  isLogin: boolean;
  status: "activated" | "suspended" | "banned";
  profileImg: string;
}

const defaultUserAccount: userAccountState = {
  email: "",
  nickName: "",
  isLogin: false,
  status: "activated",
  profileImg: "",
};

export const UserAccountState = atom<userAccountState>({
  key: "UserAccountState",
  default: defaultUserAccount,
});
