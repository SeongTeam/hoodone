'use client';
import { atom, useRecoilState } from 'recoil';
import { persistAtom } from '@/utils/recoil/recoild-persist';
import { useEffect, useState } from 'react';

export interface userAccountState {
    email: string; // identifier
    nickName: string;
    isLogin: boolean;
    status: 'activated' | 'suspended' | 'banned';
    profileImg: string;
}

const defaultUserAccount: userAccountState = {
    email: '',
    nickName: '',
    isLogin: false,
    status: 'activated',
    profileImg: '',
};

const UserAccountState = atom<userAccountState>({
    key: 'UserAccountState',
    default: defaultUserAccount,
    effects_UNSTABLE: [persistAtom],
});

// custom hook for preventing from hydration error on NextJS
// ref : https://blog.haenu.com/10#SSR%EC%97%90%EC%84%9C%EC%9D%98%20%EC%9D%B4%EC%8A%88-1
export function useUserAccountWithSSR() {
    const [isInitial, setIsInitial] = useState(true);
    const [userAccount, setUserAccount] = useRecoilState(UserAccountState);

    useEffect(() => {
        setIsInitial(false);
    }, []);

    return [isInitial ? defaultUserAccount : userAccount, setUserAccount] as const;
}
