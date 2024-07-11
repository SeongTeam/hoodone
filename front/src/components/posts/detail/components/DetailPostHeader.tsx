'use client';

import { AuthorType, POST_TYPE, QuestPost, SubmissionPost,PostContainer } from '@/type/postType';
import { formatTimeFromNow } from '@/lib/Date';
import { customColors } from '@/utils/chakra/customColors';
import { ChevronDownIcon, DragHandleIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text, Image, Spacer } from '@chakra-ui/react';
import { CldImage } from 'next-cloudinary';
import { cloudinaryTempData } from '@/utils/cloudinary/mockUpData'
import PostMenu from '../../view/postMenu';

type DetailPostHeaderProps = {
    post : PostContainer<QuestPost | SubmissionPost>,
    type : POST_TYPE
};

const DetailPostHeader: React.FC<DetailPostHeaderProps> = ({ post, type }) => {
    const time = formatTimeFromNow(post.postData.createdAt);

    const author = post.postData.author;

    return (
        <Flex w="100%" direction="row" pl="15px" pr="3px">
            <HStack w="100%" align="center">
                <Box borderRadius={'full'} w="60px" h="60px" overflow={'hidden'} position= { 'relative'}>
                    <CldImage
                        alt=' Ower profile image'
                        src={author.profileImagePublicId ?  author.profileImagePublicId : cloudinaryTempData.defaultProfilePublicId }                     
                        fill={true}
                    />
                </Box>
                <Spacer w="2px" />
                <Text w="180px" fontSize="16px">
                    {author.nickname}
                </Text>
                {/* TODO  write 시간 기록하기 동작 에러 확인하기 */}
                {/* <Spacer width="100px" /> */}
            </HStack>
            <Box h={8} w="full" />
            <HStack width="200px">
                <Text w="90px" noOfLines={1} fontSize="12px">
                    {time}
                </Text>
                <Spacer> </Spacer>
                <PostMenu type={type} post={post}/>
            </HStack>
        </Flex>
    );
};

export default DetailPostHeader;
