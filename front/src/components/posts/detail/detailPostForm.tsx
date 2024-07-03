'use client';

import { userAccountState } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import { Box, Button, Divider, Flex, HStack, Image, Spacer, Tag, Text } from '@chakra-ui/react';
import DetailPostHeader from './components/DetailPostHeader';
import ParentPostCard from './components/ParentPostCard';
import { PostType } from '@/type/postType';

type DetailPostFormProps = {
    writerAccount: userAccountState;
    post: PostType;
    communityImageURL?: string;
};

export const DetailPostForm: React.FC<DetailPostFormProps> = ({ writerAccount, post }) => {
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[300];
    // const { title, content, author, createdAt, tags } = post;

    return (
        <Box w="100%" minW="300px">
            <DetailPostHeader
                writerAccount={writerAccount}
                createDate={post.createdAt}
            ></DetailPostHeader>

            <Flex flexDirection="column" align="left" justify="center" w="100%">
                {/* title */}
                <Text
                    /**TODO bold를 사용해서 좀 더 제목처럼 보이게 하자 */
                    py={4}
                    // fontSize="1.6em"
                    fontSize={{ sm: '1.5em', md: '1.6em', lg: '1.7em' }}
                    noOfLines={4}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="wrap"
                    alignContent="left"
                    align="left"
                >
                    {'Sb:\t'}
                    {post.title}
                </Text>

                <Divider orientation="horizontal" borderColor={customColors.shadeLavender[100]} />

                <Box height={5}></Box>

                <ParentPostCard post={post} type="quest"></ParentPostCard>

                <Box height={35}></Box>
                {/* content */}
                <Text px={4} py={4} fontSize="1.3em" alignContent="left" align="left">
                    {post.content}
                </Text>
                <Spacer h="20px" />

                {/* Tag area */}
                <HStack>
                    {post.tags.map((value) => (
                        <Tag
                            maxW="200px"
                            size="lg"
                            // h="40px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            key={value}
                            borderRadius="15px"
                            bg={customColors.skyBlue[300]}
                            variant="solid"
                            color={customColors.black}
                        >
                            #{value}
                        </Tag>
                    ))}
                </HStack>
                <Box height={5}></Box>
                <Divider orientation="horizontal" borderColor={customColors.shadeLavender[100]} />
                <Box height={15}></Box>

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
            </Flex>
        </Box>
    );
};
export default DetailPostForm;
