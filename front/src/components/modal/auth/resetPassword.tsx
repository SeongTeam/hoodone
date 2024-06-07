import { Button, Flex, Icon, Input, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useForm } from 'react-hook-form';
import { CommonInput } from './components/input/common_input';
import { ButtonAndInput } from './components/input/button_and_inputs';
import { showErrorToast, showSuccessToast } from './components/toast/toast';
import { resetPassword, sendRegisterEmail } from '@/server-actions/AuthAction';

const ResetPassword: React.FC = () => {
    const PASSWORD_MIN_LEN = 8;

    interface IForm {
        email: string;
        pinCode: string;
        password: string;
    }
    const useToastOption = useToast();
    const form = useForm<IForm>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            pinCode: '',
            password: '',
        },
    });

    const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
    // const [email, setEmail] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');

    const [isPassword, setIsPassword] = useState<boolean>(false);
    const [isSendEmail, setIsSendEmail] = useState(false);

    const [error, setError] = useState('');

    const onSendResetEmail = async () => {
        try {
            const formData = new FormData();
            formData.append('toEmail', form.getValues('email'));

            const res = await sendRegisterEmail(formData);

            console.log(res);

            if (res?.ok) {
                showSuccessToast(useToastOption, { title: 'Success Send Mail!!' });
                setIsSendEmail(true);
            } else {
                showErrorToast(useToastOption, { title: 'Fail Send Mail...' });
            }
        } catch (e) {
            console.log(e);
            showErrorToast(useToastOption, { title: 'Check your email address' });
        }

        console.log('onSendResetEmail work');
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            if (!isPassword) {
                return;
            }

            const formData = new FormData();
            formData.append('email', form.getValues('email'));
            formData.append('password', form.getValues('password'));
            formData.append('pinCode', form.getValues('pinCode'));

            const res = await resetPassword(formData);

            console.log(res);
            if (res?.ok) {
                showSuccessToast(useToastOption, { title: 'Reset Success ' });
                setAuthModalState((prev) => ({
                    ...prev,
                    open: false,
                }));
            }
        } catch (e) {}
    };

    const onChangeForm = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;

        // password 유용성
        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{3,}$/;

            if (!passwordRegex.test(value) || +value.length < PASSWORD_MIN_LEN) {
                setPasswordMsg('use Numbers, letters, and special characters (!@#$%^&*+-=)');
                setIsPassword(false);
                return;
            }
            if (+value.length > 16) {
                setIsPassword(false);
                setPasswordMsg('Max length 16');
                return;
            } else {
                setPasswordMsg('Secure Password');
                setIsPassword(true);
                return;
            }
        }
    };

    return (
        <Flex direction="column" alignItems="center" gap="40px">
            <Text textAlign="center" fontSize="10pt" color="red">
                {error}
            </Text>
            <Text fontSize="sm" textAlign="center" mb={2}>
                {/* Enter the email associated with your account and we will send you a reset link */}
                Enter the email associated with your account and we will send you a pin code
            </Text>
            <form className="form-modalPage" onSubmit={onSubmit} onChange={onChangeForm}>
                <CommonInput
                    inputName="Registered Email"
                    formData={{ ...form.register('email', { required: true }) }}
                    inputType="email"
                    inputPlaceHolder="Registered Email..."
                ></CommonInput>
                {!isSendEmail ? (
                    <>
                        {' '}
                        <Button variant="oauth" onClick={onSendResetEmail}>
                            Send
                        </Button>
                    </>
                ) : (
                    <>
                        <CommonInput
                            inputName="Pin Code"
                            inputType="text"
                            formData={{ ...form.register('pinCode', { required: true }) }}
                        ></CommonInput>
                        <CommonInput
                            inputName="Password"
                            inputType="password"
                            isUsedPasswordButton={true}
                            formData={{ ...form.register('password', { required: true }) }}
                        ></CommonInput>
                        <Text
                            textAlign="center"
                            color={isPassword ? 'green' : 'red'}
                            fontSize={isPassword ? '15pt' : '10pt'}
                            paddingLeft={5}
                        >
                            {passwordMsg}
                        </Text>
                        <Button variant="oauth" type="submit">
                            Confirm
                        </Button>
                    </>
                )}
            </form>

            <Flex w="100%" justify="space-between">
                <Text
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'login',
                        }))
                    }
                >
                    LOGIN
                </Text>
                <Text
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: 'signup',
                        }))
                    }
                >
                    SIGN UP
                </Text>
            </Flex>
        </Flex>
    );
};
export default ResetPassword;
