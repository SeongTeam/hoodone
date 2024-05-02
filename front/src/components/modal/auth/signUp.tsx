import { Button, Flex, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useForm } from 'react-hook-form';

const SignUp: React.FC = () => {
    interface IForm {
        email: string;
        nickname: string;
        password: string;
        confirmPassword: string;
    }

    const form = useForm<IForm>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            nickname: '',
            password: '',
            confirmPassword: '',
        },
    });
    const [msg, setMsg] = useState('');
    const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
    const [error, setError] = useState('');
    const [certification, setCertification] = useState({
        state: false,
        code: '1234',
        inputCode: '',
        email: '',
    });

    const createUserAccount = async (email: string, nickname: string, password: string) => {
        try {
            const res = await fetch(`/api/auth/signUp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nickname,
                    email,
                    password,
                }),
                next: { revalidate: 60 },
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`sign up success response-----`);
                console.log(data);
                // TODO 유저에게 회원가입 성공했다고 알려주기/ tost 메세지 이용?
                setAuthModalState((prev) => ({
                    ...prev,
                    isOpen: false,
                }));
            } else {
                console.log(`else response-----`);
                setMsg('회원가입 오류 발생');
            }
        } catch (err) {
            console.log('sign up error', error);
            console.log(error);
        }
    };

    const onSubmit = async (data: IForm) => {
        const { email, nickname, password, confirmPassword } = data;

        if (error) setError(' error 발생');

        if (password !== confirmPassword) {
            // TODO 토스트 메세지 설치후 사용하자
            setError('Password Do Not Match');
            console.log('login error Password Do Not Match');
            return;
        }

        createUserAccount(email, nickname, password);
    };

    const onCertification = (event: React.FormEvent<HTMLFormElement>) => {
        // TODO영어와 숫자로 이루저지 않았다면 에러 발생
        function isValidEmail(email: string): boolean {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        }

        event.preventDefault();
        if (certification.inputCode !== certification.code) {
            setError('Code Do Not Match');
            return;
        }
        setCertification((prev) => ({
            ...prev,
            state: true,
        }));
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'inputCode') {
            setCertification((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));
        }
    };

    return (
        <>
            {certification.state === false ? (
                <form onSubmit={onCertification} className="form-modalPage">
                    <Text textAlign="center" color="red" fontSize="10px">
                        {error}
                    </Text>
                    <Input
                        variant="oauth"
                        required
                        placeholder="Email..."
                        type="email"
                        {...form.register('email', { required: true })}
                    />
                    <Flex w="592px" justifyContent="space-between">
                        <Input
                            variant="oauth"
                            w="400px"
                            h="70px"
                            required
                            name="inputCode"
                            placeholder="1234"
                            type="text"
                            onChange={onChange}
                        />
                        <Button variant="oauth" w="180px" h="70px">
                            Send
                        </Button>
                    </Flex>
                    <Button variant="oauth" type="submit">
                        Confirm
                    </Button>
                </form>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="form-modalPage">
                    <Text textAlign="center" color="red" fontSize="10px">
                        {}
                    </Text>
                    <Input
                        variant="oauth"
                        required
                        placeholder={certification.email}
                        type="email"
                        isDisabled={true}
                    />
                    <Input
                        variant="oauth"
                        placeholder="Nickname..."
                        type="text"
                        {...form.register('nickname', { required: true })}
                    />
                    <Input
                        variant="oauth"
                        placeholder="Password..."
                        type="password"
                        {...form.register('password', { required: true })}
                    />
                    <Input
                        variant="oauth"
                        placeholder="Confirm Password..."
                        type="password"
                        {...form.register('confirmPassword', { required: true })}
                    />
                    <Text textAlign="center" color="red" fontSize="10pt">
                        {msg}
                    </Text>
                    <Button variant="oauth" type="submit">
                        Sign Up
                    </Button>
                </form>
            )}
            <Flex marginTop={'40px'} w="100%" justify="space-between">
                <Text
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'login',
                        }))
                    }
                >
                    login
                </Text>
                <Text
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'resetPassword',
                        }))
                    }
                >
                    Forget ID/PW?
                </Text>
            </Flex>
        </>
    );
};
export default SignUp;
