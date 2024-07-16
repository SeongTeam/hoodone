'use client';

import { customColors } from '@/utils/chakra/customColors';
import { Box, Button, Divider, Flex, HStack, Icon, Image, Spacer, Tag, Text } from '@chakra-ui/react';
import DetailPostHeader from './components/DetailPostHeader';
import ParentPostCard from './components/ParentPostCard';
import { POST_TYPE, QuestPost, SubmissionPost,PostContainer } from '@/components/posts/postType';
import { addFavorite, deleteFavorite, evaluateSubmission } from '@/components/posts/postsActions';
import { UserAccountState } from '@/atoms/userAccount';
import { useRecoilState } from 'recoil';
import { useUserAccountWithSSR, useUserAccountWithoutSSR } from '@/hooks/userAccount';
import { responseData } from '@/type/responseType';
import { useEffect, useState } from 'react';
import FavoriteButton from '../common/FavoriteButton';
import { useRouter } from 'next/navigation';
import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons'

type DetailPostFormProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
    type: POST_TYPE;
};

export const DetailPostForm: React.FC<DetailPostFormProps> = ({ post, type }) => {

    const { title , content , tags } = post.postData;


    return (
        <Box w="100%" minW="300px">
            <DetailPostHeader post={post} type={type} />

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
                    {title}
                </Text>

                <Divider orientation="horizontal" borderColor={customColors.shadeLavender[100]} />

                <Box height={5}></Box>

                {type === POST_TYPE.SB && <ParentPostCard post={post} type="quest" />}

                <Box height={35}></Box>
                {/* content */}
                <Text px={4} py={4} fontSize="1.3em" alignContent="left" align="left">
                    {content}
                </Text>
                <Spacer h="20px" />

                <Box id="tags-list">
                    {tags &&
                        Array.isArray(tags) &&
                        tags.map((value) => (
                            <Tag
                                key={value}
                                variant="postTag"
                                color={customColors.black[100]}
                                mb="5px"
                                mr="5px"
                            >
                                #{value}
                            </Tag>
                        ))}
                </Box>
                <Box height={5}></Box>
                <Divider orientation="horizontal" borderColor={customColors.shadeLavender[100]} />
                <Box height={15}></Box>

                { type === POST_TYPE.QUEST ? <QuestPostButtons post={post} /> : <SubmissionPostButtons post={post} /> }
            </Flex>
        </Box>
    );
};
export default DetailPostForm;


interface QuestPostButtonsProps {
    post : PostContainer<QuestPost | SubmissionPost>;
}

const QuestPostButtons : React.FC<QuestPostButtonsProps> = ({ post }) => {
    const router = useRouter();

    const handleDoIt = () => {
        router.push(`/sb/create/${post.postData.id}`);
    };

    return (
        <Box>
            <HStack>
                <FavoriteButton type={POST_TYPE.QUEST} post={post} />
                <Button w="100px" variant={'purple'} fontSize="24px" onClick={handleDoIt}>Do it</Button>
            </HStack>
        </Box>
    )
}

interface SubmissionPostButtonsProps {
    post : PostContainer<QuestPost | SubmissionPost>;
}

const SubmissionPostButtons : React.FC<SubmissionPostButtonsProps> = ({ post }) => {

    const handleVote = async (isPositive : boolean) => {
        const result = await evaluateSubmission(POST_TYPE.SB, post.postData.id, post.paginatedOffset, isPositive);
    
        if(!result) {
            alert('please, retry later');
            return;
        }
        console.log('result', result);

        alert(result.message);

    }

    return (
        <Box>
            <HStack>
                <Button w="100px" variant={'purple'} onClick={() => handleVote(true)} >
                    <CheckIcon />
                </Button>
                <Button w="100px" variant={'purple'} onClick={() => handleVote(false)}>
                    <NotAllowedIcon />
                </Button>
            </HStack>
        </Box>
    )
}