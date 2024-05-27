import { Button, Flex, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useForm } from 'react-hook-form';
import { comparePinCode, requestCertifiedMail, signUp } from '@/server-actions/AuthAction';
import { extractErrorMessage } from '@/lib/server-only/message';
import { ExceptionDto } from 'hoodone-shared';
import { Timer } from './components/timer';
import { useToast } from '@chakra-ui/react';
enum PasswordLength {
    MIN = 8,
    MAX = 20,
}

const SignUp: React.FC = () => {
    const TIMER_MINUTE = 3;
    const TIMER_SECOND = 0;

    const EMAIL_MAX_LEN = 40;
    const PASSWORD_MIN_LEN = 8;
    const PASSWORD_MAX_LEN = '20';
    const NICKNAME_MIN_LEN = 2;
    const NICKNAME_MAX_LEN = 10;

    interface IForm {
        email: string;
        nickname: string;
        password: string;
        confirmPassword: string;
    }
    const toast = useToast();
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
    const [passwordMsg, setPasswordMsg] = useState('');
    const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
    const [error, setError] = useState('');
    const [certification, setCertification] = useState({
        state: false,
        code: '1234',
        inputCode: '',
    });

    // 유용성 검사
    const [isName, setIsName] = useState<boolean>(false);
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [isPassword, setIsPassword] = useState<boolean>(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);

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
                showSuccessToast({ title: 'Sign Up Success' });
                setAuthModalState((prev) => ({
                    ...prev,
                    isOpen: false,
                }));
            } else {
                console.log(`else response-----`);
                const exceptionData: ExceptionDto = res.response;
                // message 값이 없을 수도 있음
                const message = exceptionData.detail?.message ?? '';
                console.log(message);
                const extractedMessage = extractErrorMessage(message);

                showErrorToast({ title: 'Fail!! Sign Up ', description: extractedMessage });

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

        if (!isPassword) {
            showErrorToast({ title: 'Insecure Password' });
        }

        if (password !== confirmPassword) {
            // TODO 토스트 메세지 설치후 사용하자
            showErrorToast({
                title: 'Password Do Not Match',
            });
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
                showSuccessToast({ title: 'Match PIN code' });
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
                    showSuccessToast({ title: 'Success Send Mail' });

                    // TODO maill을 성공적으로 보냈다고 알려줌 / tost 메세지 이용?
                } else {
                    const exceptionData: ExceptionDto = res.response;
                    // message 값이 없을 수도 있음
                    const message = exceptionData.detail?.message ?? '';
                    const extractedMessage = extractErrorMessage(message);
                    showErrorToast({
                        title: '회원가입 오류 발생',
                        description: extractedMessage,
                    });

                    console.log(exceptionData);
                    setError(`오류 발생\n ${extractedMessage}`);
                    return;
                }
            } catch (err) {
                // console.log('send email error', error);
                showErrorToast({ title: 'Error!! ' });
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

    /** React.FormEventHandler<HTMLFormElement>를 event에 타입으로 사용하면
     * event.target.name을 찾을 수 없어서 에러가 발생한다. */
    const onChangeForm = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        // password 유용성
        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{3,}$/;

            console.log(+value.length);
            if (!passwordRegex.test(value) || +value.length < PASSWORD_MIN_LEN) {
                setPasswordMsg('Numbers, letters, and special characters (!@#$%^&*+-=)');
                setIsPassword(false);
            } else {
                setPasswordMsg('Secure Password');
                setIsPassword(true);
            }
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
                                if (checkValidEmail(toEmail) && !isTimerStart) {
                                    onSendEmail();
                                    setIsTimerStart(true);
                                    return;
                                }
                                if (isTimerStart) onResendEmail();
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
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={onChangeForm}
                    className="form-modalPage"
                >
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
                        // maxlength="5"
                        {...form.register('nickname', { required: true, max: 20 })}
                    />
                    <div className="container">
                        <Text
                            textAlign="center"
                            color={isPassword ? 'green' : 'red'}
                            fontSize={isPassword ? '15pt' : '10pt'}
                        >
                            {passwordMsg}
                        </Text>
                    </div>
                    <Input
                        variant="oauth"
                        placeholder="Password..."
                        type="password"
                        minLength={5}
                        maxLength={10}
                        {...form.register('password', {
                            required: true,
                        })}
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

    function showSuccessToast(content: { title: string; description?: string }) {
        return toast({
            title: content.title,
            description: content.description,
            status: 'success',
            duration: 4000,
            isClosable: true,
        });
    }

    function showErrorToast(content: { title: string; description?: string }) {
        return toast({
            title: content.title,
            description: content.description,
            status: 'error',
            duration: 7000,
            isClosable: true,
        });
    }
};
export default SignUp;
