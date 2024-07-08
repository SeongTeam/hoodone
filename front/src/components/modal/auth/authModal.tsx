import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/atoms/authModal';
import { useUserAccountValue } from "@/hooks/userAccount";
import AuthInput from './authInput';
import ResetPassword from './resetPassword';
import { customColors } from '@/utils/chakra/customColors';

/*TODO
- accessToken 만료까지 User 로그인 상태 유지하도록 수정하기
  - 새로 고침시, 로그인 아이콘 변경되는 이슈 해결하기
*/

const AuthModal: React.FC = () => {
    //const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalState, setModalState] = useRecoilState(AuthModalState);
    const userState = useUserAccountValue();
    const bg = customColors.black[200];
    const fontColor = customColors.white[100];

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };

    /* TODO
    - recoil state와 useEffect 혼합 사용 구현하기 
    */
    useEffect(() => {
        if (userState.isLogin) handleClose();
        //console.log(user, "🔥🔥");
    }, [userState]);

    return (
        <>
            <Modal isOpen={modalState.isOpen} onClose={handleClose} size="2xl">
                <ModalOverlay />
                <ModalContent px="40px" bg={bg} color={fontColor} borderRadius="15px" gap="40px">
                    <ModalHeader textAlign="center" fontSize="40px">
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Recovery ID/PW'}
                    </ModalHeader>
                    <ModalCloseButton border="1px solid #FFFFFF" borderRadius={'50%'} />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Flex direction="column" align="center" justify="center" width="70%">
                            {modalState.view === 'login' || modalState.view === 'signup' ? (
                                <>
                                    <Text color="gray.500" fontWeight={700}>
                                        이용약관
                                    </Text>
                                    <AuthInput />
                                </>
                            ) : (
                                <ResetPassword />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AuthModal;
