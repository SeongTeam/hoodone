import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import Icons from './icons';
import UserMenu from './userMenu';
import AuthButtons from './authButtons';
import { useRecoilState } from 'recoil';
import AuthModal from '@/components/modal/auth/authModal';
import { useUserAccountWithSSR } from '@/atoms/userAccount';

const RightContent: React.FC = () => {
    const [user, setUser] = useUserAccountWithSSR();

    return (
        <>
            <AuthModal />
            <Flex justify="center" align="center">
                {user.isLogin ? (
                    <>
                        {' '}
                        <Icons /> <UserMenu />{' '}
                    </>
                ) : (
                    <AuthButtons />
                )}
            </Flex>
        </>
    );
};
export default RightContent;
