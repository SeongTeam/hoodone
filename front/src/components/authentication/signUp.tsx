"use client";
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useForm } from 'react-hook-form';
import { comparePinCode, requestCertifiedMail, signUp } from '@/server-actions/AuthAction';
import { extractErrorMessage } from '@/lib/server-only/message';
import { ExceptionDto } from '@/sharedModule/response-dto/exception-dto';
import { Timer } from './components/timer';
import { useToast } from '@chakra-ui/react';
import { CommonInput } from './components/common_input';
import { ButtonAndInput } from './components/button_and_inputs';
import { showErrorToast, showSuccessToast, showWarringToast } from './components/toast';
import { useRouter } from 'next/navigation';

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
        pinCode: string;
    }
    const useToastOption = useToast();
    const form = useForm<IForm>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            nickname: '',
            password: '',
            confirmPassword: '',
            pinCode: '',
        },
    });
    const [isTimerStart, setIsTimerStart] = useState(false);
    const [min, _setMin] = useState(TIMER_MINUTE);
    const [sec, _setSec] = useState(TIMER_SECOND);

    const [msg, setMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
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
    const router = useRouter();

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
                // TODO 유저에게 회원가입 성공했다고 알려주기/ tost 메세지 이용?
                showSuccessToast(useToastOption, { title: 'Sign Up Success, go to login' });
                setTimeout(() => {
                    router.push('/authentication/sign-in');
                }, 2000);

            } else {
                console.log(`else response-----`);
                const exceptionData: ExceptionDto = res.response;
                // message 값이 없을 수도 있음
                const message = exceptionData.detail?.message ?? '';
                console.log(message);
                const extractedMessage = extractErrorMessage(message);

                showErrorToast(useToastOption, {
                    title: 'Fail!! Sign Up ',
                    description: extractedMessage,
                });

                setMsg(`Sorry for error, please retry later\n ${extractedMessage}`);
            }
        } catch (err) {
            console.log('sign up error', error);
            console.log(error);
        }
    };

    const onSubmit = async (data: IForm) => {
        const { email, nickname, password, confirmPassword } = data;
        console.log(data);

        if (!isPassword) {
            showErrorToast(useToastOption, { title: 'Insecure Password' });
            return;
        }

        if (password !== confirmPassword) {
            // TODO 토스트 메세지 설치후 사용하자
            showErrorToast(useToastOption, {
                title: 'Password Do Not Match',
            });
            setError('Password Do Not Match');
            console.log('login error Password Do Not Match');
            return;
        }

        createUserAccount(email, nickname, password);
    };

    const onCertification = async (event: React.FormEvent<HTMLFormElement>) => {
        // TODO영어와 숫자로 이루어지지 않았다면 에러 발생

        event.preventDefault();

        console.log(form.getValues('pinCode'));

        const formData = new FormData();
        formData.append('email', form.getValues('email'));
        formData.append('pinCode', form.getValues('pinCode'));
        try {
            const result = await comparePinCode(formData);

            if (result.ok) {
                showSuccessToast(useToastOption, { title: 'Match PIN code' });
                setCertification((prev) => ({
                    ...prev,
                    state: true,
                }));
                return;
            }

            showErrorToast(useToastOption, { title: 'Code Do Not Match' });
            setError('Code Do Not Match');
            return;
        } catch (e) {
            console.log(e);
            setError('Error!!! Code Do Not Match');
        }
    };

    const sendPincode = async () => {
        const toEmail = form.getValues('email');
        if (!checkValidEmail(toEmail)) {
            setError('pleae, check email address');
            return;
        }
            
        try {
            const res = await requestCertifiedMail(toEmail);
            if (res.ok) {
                console.log(`success request CertifiedMail`);
                showSuccessToast(useToastOption, { title: 'Success Send Mail' });

                // TODO maill을 성공적으로 보냈다고 알려줌 / tost 메세지 이용?
            } else {
                const exceptionData: ExceptionDto = res.response;
                // message 값이 없을 수도 있음
                const message = exceptionData.detail?.message ?? '';
                const extractedMessage = extractErrorMessage(message);
                showErrorToast(useToastOption, {
                    title: 'Sign Up Fail',
                    description: extractedMessage,
                });

                console.log(exceptionData);
                setError(`Sign Up Fail\n ${extractedMessage}`);
                return;
            }
        } catch (err) {
            // console.log('send email error', error);
            showErrorToast(useToastOption, { title: 'sorry for Error. please, retry later' });
            console.log(error);
            return;
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
                setPasswordMsg('use Numbers, letters, and special characters (!@#$%^&*+-=)');
                setIsPassword(false);
            } else {
                setPasswordMsg('Secure Password');
                setIsPassword(true);
            }
        }
    };

    const handleSendPintCodeButton = () => {
        const toEmail = form.getValues('email');
        // 타이머가 작동 안했을 겨우 동작
        if (checkValidEmail(toEmail) && !isTimerStart) {
            sendPincode();
            setIsTimerStart(true);
        }
        else if (isTimerStart) resendPincode();
        else {
            setError('please check email');
        }
    }

    function checkValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailRegex.test(email);
    }
    function resendPincode() {
        /**TODO)  pop 창을 보여줘서 새로 보냈다라는 것을 알려주자*/
        if (min <= 0) {
            console.log('Please refresh your email due to timeout.');
            showWarringToast(useToastOption, {
                title: 'Please refresh your email due to timeout.',
            });
        }
        if (TIMER_MINUTE - 1 > min) {
            console.log(`${min}: ${sec}`);
            sendPincode();

            setMinute(TIMER_MINUTE);
            setSecond(1); // UI를 위해서 1을 넣고 있습니다
        } else {
            showWarringToast(useToastOption, { title: 'Resending is available in 1 minute.' });
        }
    }

    return (
        <Box>
            {certification.state === false ? (
                <form onSubmit={onCertification} className="form-modalPage">
                    <Text textAlign="center" color="red" fontSize="16px">
                        {error}
                    </Text>
                    <CommonInput
                        inputName="Email"
                        formData={{ ...form.register('email', { required: true }) }}
                        inputType="email"
                        inputPlaceHolder="Enter Email"
                    ></CommonInput>

                    <ButtonAndInput
                        inputName="Pin Code"
                        inputType="text"
                        formData={{ ...form.register('pinCode', { required: true }) }}
                        buttonName={isTimerStart ? 'Resend' : 'Send'}
                        onClickButton={() => {
                            handleSendPintCodeButton();
                        }}
                        inputPlaceHolder="Enter Pin code from your email"
                    />
                    <Box>
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
                    </Box>
                    <Button
                        w="180px"
                        h="60px" 
                        variant="purple" 
                        fontSize = "24px"
                        type="submit">
                        Confirm
                    </Button>
                </form>
            ) : (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={onChangeForm}
                    className="form-modalPage"
                >
                    <CommonInput
                        inputName="Email"
                        inputType="email"
                        isDisabled={true}
                        formData={{ ...form.register('email', { required: true, max: 20 }) }}
                    />
                    <CommonInput
                        inputName="Nickname"
                        inputType="text"
                        formData={{ ...form.register('nickname', { required: true, max: 20 }) }}
                        inputPlaceHolder="Enter Nickname"
                    />
                    <CommonInput
                        inputName="Password"
                        inputType="password"
                        inputPlaceHolder="Enter password"
                        isUsedPasswordButton={true}
                        formData={{ ...form.register('password', { required: true, max: 20 }) }}                    />
                    <Text
                        textAlign="center"
                        color={isPassword ? 'green' : 'red'}
                        fontSize={isPassword ? '15pt' : '10pt'}
                        paddingLeft={5}
                    >
                        {passwordMsg}
                    </Text>
                    <CommonInput
                        inputName="Confirm Password"
                        inputType="password"
                        inputPlaceHolder="Enter confirmed password"
                        isUsedPasswordButton={true}
                        formData={{
                            ...form.register('confirmPassword', { required: true, max: 20 }),
                        }}
                    />
                    <Text textAlign="center" color="red" fontSize="10pt">
                        {msg}
                    </Text>
                    <Button
                        w="180px"
                        fontSize="24px"
                        h="60px" 
                        variant="purple" 
                        type="submit">
                        Sign Up
                    </Button>
                </form>
            )}
        </Box>
    );
};
export default SignUp;
