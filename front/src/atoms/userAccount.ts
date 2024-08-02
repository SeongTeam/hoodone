'use client';
import { atom } from 'recoil';
import { persistAtom } from '@/utils/recoil/recoild-persist';

export interface userAccountState {
    email: string;
    nickname: string; // identifier
    isLogin: boolean;
    status: 'activated' | 'suspended' | 'banned';
    profileImg: string;
    favoriteQuests: number[];
    favoriteSbs: number[];
}

export const defaultUserAccount: userAccountState = {
    email: '',
    nickname: '',
    isLogin: false,
    status: 'activated',
    profileImg: '',
    favoriteQuests: [],
    favoriteSbs: [],
};

export const UserAccountState = atom<userAccountState>({
    key: 'UserAccountState',
    default: defaultUserAccount,
    effects_UNSTABLE: [persistAtom],
});
