import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import Icons from './icons';
import UserMenu from './userMenu';
import AuthButtons from './authButtons';
import { UserAccountState } from '@/atoms/userAccount';
import { useRecoilState } from 'recoil';
import AuthModal from '@/components/modal/auth/authModal';

const RightContent: React.FC = () => {
    const [user] = useRecoilState(UserAccountState);

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
