import { recoilPersist } from 'recoil-persist';

const storage = typeof window !== 'undefined' ? window?.sessionStorage : undefined;

// ref : https://velog.io/@wswy17/React-Recoil-persist-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
export const { persistAtom } = recoilPersist({
    key: 'persistAtom',
    storage: storage,
});
