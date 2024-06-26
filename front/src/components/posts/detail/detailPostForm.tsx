import { userAccountState } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import {
    Box,
    HStack,
    VStack,
    Text,
    Image,
    Tag,
    Divider,
    Button,
    Container,
    Flex,
    Spacer,
} from '@chakra-ui/react';
import { AddIcon, AttachmentIcon, DragHandleIcon, StarIcon } from '@chakra-ui/icons';
import CommentArea from '@/components/comment/server-component/commentArea';
import { PostType } from '@/atoms/post';

const mockContent =
    '1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 ';

type DetailPostFormProps = {
    writerAccount: userAccountState;
    postInfo: PostType;
    communityImageURL?: string;
    isQuestPost: boolean;
};

const DetailPostForm: React.FC<DetailPostFormProps> = ({
    writerAccount,
    isQuestPost,
    postInfo,
}) => {
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[300];
    const { title, content, imgUrl, author, createdAt, likeCount, tags } = postInfo;

    return (
        <Box
            minW={{
                sm: '600px',
                base: '700px',
                lg: '800px',
            }}
        >
            <VStack
                align="stretch"
                spacing="20px"
                py="20px"
                px="16px"
                direction="column"
                width="100%"
            >
                <Flex direction="row" px="15px">
                    <HStack align="center" spacing="6px">
                        <Image
                            borderRadius="full"
                            boxSize="60px"
                            src="https://bit.ly/dan-abramov"
                            alt="Dan Abramov"
                        />
                        <Text w="180px" fontSize="16px" bg="green">
                            {author.nickname}
                        </Text>
                        {/* TODO  write 시간 기록하기 동작 에러 확인하기 */}
                        {/* <Spacer width="100px" /> */}

                        <Text fontSize="12px">{' ~1h'}</Text>
                        <Text fontSize="12px">{' ago'}</Text>
                    </HStack>
                    <Box h={8} w="full" />
                    <Box bg="yellow" width="80px">
                        <Text> Icon seat</Text>
                        {/* TODO  Charkra Icon 동작 에러 확인하기 */}
                        {/* <StarIcon />
                            <DragHandleIcon /> */}
                    </Box>
                </Flex>
                <Text fontSize="24px">{title}</Text>

                <Divider orientation="horizontal" />

                <Text>{content}</Text>

                <HStack>
                    {tags.map((value) => (
                        <Tag
                            size="lg"
                            key={value}
                            borderRadius="30px"
                            bg={customColors.skyBlue[300]}
                            variant="solid"
                            color={customColors.black}
                        >
                            #{value}
                        </Tag>
                    ))}
                </HStack>

                <HStack>
                    <Button
                        bg={customColors.purple[100]}
                        _hover={{ bg: customColors.white[300] }}
                        borderRadius="8px"
                        width="5em"
                        fontSize="20px"
                        py="20px"
                        px="15px"
                    >
                        {/* <AddIcon /> */}
                        1k
                    </Button>
                    <Button
                        bg={customColors.purple[100]}
                        _hover={{ bg: customColors.white[300] }}
                        borderRadius="8px"
                        width="5em"
                        fontSize="20px"
                        py="20px"
                        px="15px"
                    >
                        Do it
                    </Button>
                </HStack>
                <Box w="full" h="250px" bg="green">
                    <Text>SubMission</Text>
                    <Text>나중에 구현</Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default DetailPostForm;
