'use client';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { signIn } from '@/server-actions/AuthAction';
import { useForm } from 'react-hook-form';
import { CommonInput } from './components/input/common_input';
import { SignInDTO } from '@/type/server-action/AuthType';

type LoginProps = {};

/* TODO
- Server Action 오류 처리 로직 구현
- input value validation 구현
- useForm 이해하기
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

    const [userState, setUserState] = useUserAccountWithSSR();
    const [msg, setMsg] = useState('');

    const loginWithEmailAndPassword = async (email: string, password: string) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const res = await signIn(formData);

        if (res.ok) {
            const { nickname }  = res.response as SignInDTO;
            setUserState((prev) => ({
                ...prev,
                nickname: nickname,
                isLogin: true,
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
        <Box>
        <form onSubmit={onSubmit} className="form-modalPage">
            <Flex 
                mt = "30px"
                w='full'
                justifyContent="center"

                >
                <Text textAlign="center" color="red" fontSize="16pt">
                    {msg}
                </Text>
            </Flex>
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
        </form>
        </Box>
    );
};
export default Login;
