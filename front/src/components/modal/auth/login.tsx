'use client';
import { Button, Flex, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { AuthModalState } from '@/atoms/authModal';
import { useUserAccountWithSSR } from '@/atoms/userAccount';
import logger from '@/utils/log/logger';
import { signIn } from '@/server-actions/AuthAction'
import { customColors } from '@/utils/chakra/customColors';

type LoginProps = {};

/* TODO
- Server Action 오류 처리 로직 구현
*/
const Login: React.FC<LoginProps> = () => {
    const [authModalState, setAuthModelState] = useRecoilState(AuthModalState);
    const [userState, setUserState] = useUserAccountWithSSR();
    const [msg, setMsg] = useState('');
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const fontColor = customColors.white[100];

    const loginWithEmailAndPassword = async (email: string, password: string) => {
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const res = await signIn(formData);

        console.log(`[loginWithEmailAndPassword]`, res);

        if(res.ok) {
        /*TODO
        - nickname 등의 유저 정보를 서버에서 가져오는 로직 필요 
        */
        setUserState((prev) => ({
            ...prev,
            email: email,
            isLogin: true,
        }));
        setAuthModelState((prev) => ({
            ...prev,
            open: false,
        }));
    } else {
        setMsg(res.message);
    }

    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update state
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <form onSubmit={onSubmit} className="form-modalPage">
            <Text textAlign="center" color="red" fontSize="10pt">
                {msg}
            </Text>
            <Input
                variant="oauth"
                required
                name="email"
                placeholder="Email..."
                type="email"
                onChange={onChange}
            />
            <Input
                variant="oauth"
                required
                name="password"
                placeholder="Password..."
                type="password"
                onChange={onChange}
            />
            <Button variant="oauth" type="submit">
                Log In
            </Button>
            <Flex w="100%" justify={'space-between'} color={fontColor}>
                <Text
                    cursor="pointer"
                    onClick={() =>
                        setAuthModelState((prev) => ({
                            ...prev,
                            view: 'resetPassword',
                        }))
                    }
                >
                    Forget ID/PW?
                </Text>
                <Text
                    cursor="pointer"
                    onClick={() =>
                        setAuthModelState((prev) => ({
                            ...prev,
                            view: 'signup',
                        }))
                    }
                >
                    Sign Up
                </Text>
            </Flex>
        </form>
        
    );
};
export default Login;
