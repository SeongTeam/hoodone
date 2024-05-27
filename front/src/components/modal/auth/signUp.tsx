import { Button, Flex, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useForm } from 'react-hook-form';
import { comparePinCode, requestCertifiedMail, signUp } from '@/server-actions/AuthAction';
import { extractErrorMessage } from '@/lib/server-only/message';
import { ExceptionDto } from 'hoodone-shared';
import { Timer } from './components/timer';

const SignUp: React.FC = () => {
    const TIMER_MINUTE = 3;
    const TIMER_SECOND = 0;

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
    const [isTimerStart, setIsTimerStart] = useState(false);
    const [min, _setMin] = useState(TIMER_MINUTE);
    const [sec, _setSec] = useState(TIMER_SECOND);

    const [msg, setMsg] = useState('');
    const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
    const [error, setError] = useState('');
    const [certification, setCertification] = useState({
        state: false,
        code: '1234',
        inputCode: '',
    });

    const setMinute: Function = (minute: number | null) => {
        if (typeof minute == 'number') {
            _setMin(minute);
        }
        return min;
    };

    const setSecond: Function = (second: number | null) => {
        if (typeof second == 'number') {
            _setSec(second);
        }
        return sec;
    };

    const createUserAccount = async (email: string, nickname: string, password: string) => {
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('nickname', nickname);

            const res = await signUp(formData);

            if (res.ok) {
                console.log(`sign up success response-----`);
                console.log(res);
                // TODO 유저에게 회원가입 성공했다고 알려주기/ tost 메세지 이용?
                setAuthModalState((prev) => ({
                    ...prev,
                    isOpen: false,
                }));
            } else {
                console.log(`else response-----`);
                const exceptionData: ExceptionDto = res.response;
                // message 값이 없을 수도 있음
                const message = exceptionData.detail?.message ?? '';
                const extractedMessage = extractErrorMessage(message);

                setMsg(`회원가입 오류 발생\n ${extractedMessage}`);
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

    const onCertification = async (event: React.FormEvent<HTMLFormElement>) => {
        // TODO영어와 숫자로 이루저지 않았다면 에러 발생

        event.preventDefault();

        console.log(certification.inputCode);

        const formData = new FormData();
        formData.append('email', form.getValues('email'));
        formData.append('pinCode', certification.inputCode);
        try {
            const result = await comparePinCode(formData);

            if (result.ok) {
                setCertification((prev) => ({
                    ...prev,
                    state: true,
                }));
            }

            setError('Code Do Not Match');
            return;
        } catch (e) {
            console.log(e);
            setError('Error!!! Code Do Not Match');
        }
    };

    const onSendEmail = async () => {
        const toEmail = form.getValues('email');
        if (checkValidEmail(toEmail)) {
            console.log(toEmail);
            const res = await requestCertifiedMail(toEmail);
            try {
                if (res.ok) {
                    console.log(`success request CertifiedMail`);

                    // TODO maill을 성공적으로 보냈다고 알려줌 / tost 메세지 이용?
                } else {
                    console.log(`else response-----`);

                    const exceptionData: ExceptionDto = res.response;
                    // message 값이 없을 수도 있음
                    const message = exceptionData.detail?.message ?? '';
                    const extractedMessage = extractErrorMessage(message);

                    setError(`이메일 전송 오류 발생\n ${extractedMessage}`);
                    return;
                }
            } catch (err) {
                console.log('send email error', error);
                console.log(error);
                return;
            }
        } else {
            setError('email 형식이 이상합니다');
            return;
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'inputCode') {
            setCertification((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }));
        }
    };

    function checkValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function onResendEmail() {
        /**TODO)  pop 창을 보여줘서 새로 보냈다라는 것을 알려주자*/
        if (min <= 0) {
            console.log(`시간 경과로  다시 email 검사를 해야 합니다.  새로고침을 눌러주세요`);
        }
        if (TIMER_MINUTE - 1 > min) {
            console.log(`${min}: ${sec}`);
            onSendEmail();

            setMinute(TIMER_MINUTE);
            setSecond(1); // UI를 위해서 1을 넣고 있습니다
        } else {
            console.log(`1분 경과되어야 다시 보낼 수 있습니다`);
        }
    }

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
                        <Button
                            variant="oauth"
                            w="180px"
                            h="70px"
                            onClick={async () => {
                                const toEmail = form.getValues('email');

                                // 타이머가 작동 안했을 겨우 동작
                                if (!isTimerStart) {
                                    onSendEmail();
                                    setIsTimerStart(true);
                                    return;
                                }
                                onResendEmail();
                            }}
                        >
                            {isTimerStart ? 'Resend' : 'Send'}
                        </Button>
                    </Flex>
                    <div>
                        {isTimerStart ? (
                            <Timer
                                setSecond={setSecond}
                                setMinute={setMinute}
                                minute={min}
                                second={sec}
                                isStart={isTimerStart}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
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
                        placeholder={''}
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
