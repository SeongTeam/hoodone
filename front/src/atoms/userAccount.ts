'use client';
import { atom } from 'recoil';
import { persistAtom } from '@/utils/recoil/recoild-persist';

export interface userAccountState {
    nickname: string; // identifier
    isLogin: boolean;
    status: 'activated' | 'suspended' | 'banned';
    profileImg: string;
}

export const defaultUserAccount: userAccountState = {
    nickname: '',
    isLogin: false,
    status: 'activated',
    profileImg: '',
};

export const UserAccountState = atom<userAccountState>({
    key: 'UserAccountState',
    default: defaultUserAccount,
    effects_UNSTABLE: [persistAtom],
});
