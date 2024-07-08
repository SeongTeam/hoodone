'use client';

import { customColors } from '@/utils/chakra/customColors';
import { Box, Button, Divider, Flex, HStack, Image, Spacer, Tag, Text } from '@chakra-ui/react';
import DetailPostHeader from './components/DetailPostHeader';
import ParentPostCard from './components/ParentPostCard';
import { POST_TYPE, PostType } from '@/type/postType';

type DetailPostFormProps = {
    post: PostType;
    type : POST_TYPE
};

export const DetailPostForm: React.FC<DetailPostFormProps> = ({ post, type }) => {
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[300];



    const handleFavorite = () => {
        alert('Favorite is not implemented yet');
    }
    const handleDoIt = () => {
        alert('Do it is not implemented yet');
    }


    return (
        <Box w="100%" minW="300px">
            <DetailPostHeader
                post = {post}
            />


            <Flex flexDirection="column" align="left" justify="center" w="100%">
                {/* title */}
                <Text
                    /**TODO bold를 사용해서 좀 더 제목처럼 보이게 하자 */
                    py={4}
                    // fontSize="1.6em"
                    fontSize={{ md: '24px', lg: '28px' }}
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

                {type === POST_TYPE.SB && <ParentPostCard post={post} type="quest"/>}

                <Box height={35}></Box>
                {/* content */}
                <Text px={4} py={4} fontSize="1.3em" alignContent="left" align="left">
                    {post.content}
                </Text>
                <Spacer h="20px" />


                <Box
                    id="tags-list"
                    >
                    {post.tags && Array.isArray(post.tags) && post.tags.map((value) => (
                        <Tag
                            key={value}
                            variant="postTag"
                            color={customColors.black[100]}
                            mb = "5px"
                            mr = "5px"
                        >
                            #{value}
                        </Tag>
                    ))}
                </Box>
                <Box height={5}></Box>
                <Divider orientation="horizontal" borderColor={customColors.shadeLavender[100]} />
                <Box height={15}></Box>

                <HStack>
                    <Button
                        w="100px"
                        variant={"purple"}
                        onClick={handleFavorite}
                    >
                        {/* <AddIcon /> */}
                        {post.favoriteCount}
                    </Button>
                    <Button
                        w="100px"
                        variant={"purple"}
                        fontSize = "24px"
                        onClick={handleDoIt}
                    >
                        Do it
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
};
export default DetailPostForm;
