import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';

const ResetPassword: React.FC = () => {
    const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');


    const sendResetEmail = async (email: string) => {
    /*TODO
    - server Component fetch 로직 추가.
    */
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await sendResetEmail(email);
        setSuccess(true);
    };

    return (
        <Flex direction="column" alignItems="center" gap="40px">
            {success ? (
                <Text fontWeight={700}>Check your email :)</Text>
            ) : (
                <>
                    <Text textAlign="center" fontSize="10pt" color="red">
                        {error}
                    </Text>
                    <Text fontSize="sm" textAlign="center" mb={2}>
                        Enter the email associated with your account and we will send you a reset
                        link
                    </Text>
                    <form className="form-modalPage" onSubmit={onSubmit}>
                        <Input
                            variant="oauth"
                            required
                            name="email"
                            placeholder="Registered Email..."
                            type="email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Button variant="oauth" type="submit">
                            Confirm
                        </Button>
                    </form>
                </>
            )}
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
