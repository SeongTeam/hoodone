import { customColors } from '@/utils/chakra/customColors';
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Wrap,
    WrapItem,
    Text,
    Spacer,
    Box,
    Textarea,
    HStack,
    useToast,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { ExceptionDto, ReportEnum } from 'hoodone-shared';
import { sendReport } from '@/server-actions/reportAction';
import { showErrorToast, showSuccessToast } from '../modal/auth/components/toast/toast';
import { extractErrorMessage } from '@/lib/server-only/message';

export const ReportTargetEnum = {
    QUEST: 'QUEST',
    SB: 'SB',
    COMMENT: 'COMMENT',
};

type ReportTargetEnumType = keyof typeof ReportTargetEnum;

interface RePortModalProps {
    target: ReportTargetEnumType;
    id: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportModal: React.FC<RePortModalProps> = ({ id, target, isOpen, onClose }) => {
    const fontColor = customColors.black[300];
    const bg = customColors.gray[100];
    const inputBorderColor = customColors.black[100];
    const focusBorderColor = customColors.black[300];
    const useToastOption = useToast();

    const [reportEnum, setReportEnum] = useState(`${ReportEnum.OTHER}`);
    const [content, setContent] = useState('');
    const [modalState, setModalState] = useState(isOpen);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setContent(event.target.value);

    const onMOck = () => {
        console.log(target);
    };

    const onSubmit = async () => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('reportEnum', reportEnum);
        formData.append('target', target);
        formData.append('id', id.toString());

        try {
            const res = await sendReport(formData);
            if (res.ok) {
                console.log(`success Send Report!!`);
                showSuccessToast(useToastOption, { title: 'Success Send Report' });

                // TODO maill을 성공적으로 보냈다고 알려줌 / tost 메세지 이용?
            } else {
                const exceptionData: ExceptionDto = res.response;
                // message 값이 없을 수도 있음
                const message = exceptionData.detail?.message ?? '';
                const extractedMessage = extractErrorMessage(message);
                showErrorToast(useToastOption, {
                    title: 'Send Report Fail',
                    description: extractedMessage,
                });

                console.log(exceptionData);
                onClose;
                return;
            }
        } catch (err) {
            showErrorToast(useToastOption, { title: 'sorry for Error. please, retry later' });
            console.log(err);
            return;
        }
    };

    const ReportBtn: React.FC<{ btnTitle: string }> = ({ btnTitle }) => {
        console.log(`${btnTitle}: ${btnTitle.length} `);
        return (
            <Button
                key={`${btnTitle}-btn-key`}
                variant="purple"
                title={btnTitle}
                fontSize={{ base: '0.8em', sm: '0.9em', md: '1em', lg: '1em' }}
                fontWeight={{ base: '300', sm: '300', md: '600', lg: '600' }}
                w={{ sm: `${btnTitle.length * 5}`, md: `${btnTitle.length * 12}px` }}
                minW="70px"
                maxW="310px"
                py={{ sm: '4px', md: '12px' }}
                onClick={() => {
                    setReportEnum(btnTitle);
                }}
            >
                {btnTitle}
            </Button>
        );
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="2xl">
                <ModalOverlay />
                <ModalContent px="10px" bg={bg} color={fontColor} borderRadius="15px" gap="10px">
                    <ModalHeader textAlign="left">
                        <Text
                            as="b"
                            color={customColors.black[100]}
                            fontSize="30px"
                            fontWeight="600"
                        >
                            Submit a report
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton border="1px solid #FFFFFF" borderRadius={'50%'} />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Flex direction="column" align="left" justify="center" width="100%">
                            <Wrap align="center" spacingX="5px" spacingY="10px">
                                {Object.values(ReportEnum).map((value) => (
                                    <>
                                        <WrapItem key={`${value}-WrapItem `}>
                                            {ReportBtn({ btnTitle: value })}
                                        </WrapItem>
                                        <Flex w="10px"></Flex>
                                    </>
                                ))}
                            </Wrap>
                            <Spacer h={'12px'} />
                            <Box width="100%" py="20px">
                                <HStack>
                                    <Text fontSize="20px" color={customColors.black[100]}>
                                        Report type:
                                    </Text>
                                    <Text
                                        as="i"
                                        fontSize="18px"
                                        color={customColors.pastelGreen[100]}
                                    >
                                        {' '}
                                        {reportEnum}
                                    </Text>
                                </HStack>
                                <Textarea
                                    // my={'15px'}
                                    mt="5px"
                                    border={`1px solid ${inputBorderColor}`}
                                    focusBorderColor={focusBorderColor}
                                    borderRadius="8px"
                                    color={fontColor}
                                    name="title"
                                    value={content}
                                    onChange={handleChange}
                                    fontSize="18px"
                                    placeholder={'Freely Leave Content'}
                                    _placeholder={{ color: `${fontColor}` }}
                                    bg={bg}
                                />
                            </Box>

                            <HStack justify="right" spacing="20px" w="100%">
                                <Button
                                    onClick={() => {
                                        onSubmit();
                                    }}
                                    variant="purple"
                                    borderRadius="8px"
                                    fontSize="20px"
                                    width="100px"
                                    py="20px"
                                    px="15px"
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="cancel"
                                    borderRadius="8px"
                                    fontSize="20px"
                                    width="100px"
                                    py="20px"
                                    px="15px"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </HStack>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
