import { defaultUserAccount, UserAccountState ,userAccountState } from "@/atoms/userAccount";
import logger from "@/utils/log/logger";
import react , { useEffect, useState } from "react";
import { useRecoilState } from "recoil";


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

export function useUserAccountValue() {
    const [userAccount] = useRecoilState(UserAccountState);
    
    return userAccount
}

export function useIsOwner(nickname : string ) {

    const [userAccount] = useUserAccountWithSSR();

    if(!userAccount.isLogin) return false
    
    return userAccount.nickname === nickname

}