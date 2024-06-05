'use client';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { AuthModalState } from '@/atoms/authModal';
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { signIn } from '@/server-actions/AuthAction';
import { customColors } from '@/utils/chakra/customColors';
import { useForm } from 'react-hook-form';
import { CommonInput } from './components/input/common_input';

type LoginProps = {};

/* TODO
- Server Action 오류 처리 로직 구현
*/
const Login: React.FC<LoginProps> = () => {
    interface IForm {
        email: string;
        password: string;
    }
    const form = useForm<IForm>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
        },
    });

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

        if (res.ok) {
            const nickname = res.response.nickname;
            setUserState((prev) => ({
                ...prev,
                nickname: nickname,
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

        const email = form.getValues('email');
        const password = form.getValues('password');

        loginWithEmailAndPassword(email, password);
    };

    return (
        <form onSubmit={onSubmit} className="form-modalPage">
            <Text textAlign="center" color="red" fontSize="10pt">
                {msg}
            </Text>
            <CommonInput
                inputName="Email"
                inputType="email"
                inputPlaceHolder="Enter email"
                formData={{ ...form.register('email', { required: true, max: 20 }) }}
            ></CommonInput>
            <CommonInput
                inputName="Password"
                inputType="password"
                inputPlaceHolder="Enter password"
                formData={{ ...form.register('password', { required: true, max: 20 }) }}
            ></CommonInput>
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
