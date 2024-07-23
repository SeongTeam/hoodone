'use client';

import { AuthorType, POST_TYPE, QuestPost, SubmissionPost,PostContainer } from '@/components/posts/postType';
import { formatTimeFromNow } from '@/lib/Date';
import { customColors } from '@/utils/chakra/customColors';
import { ChevronDownIcon, DragHandleIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text, Image, Spacer } from '@chakra-ui/react';
import { CldImage } from 'next-cloudinary';
import { cloudinaryTempData } from '@/utils/cloudinary/mockUpData'
import PostMenu from './postMenu';
import { ProfileImage } from '@/components/common/ProfileImage';

type DetailPostHeaderProps = {
    post : PostContainer<QuestPost | SubmissionPost>,
    type : POST_TYPE
};

const DetailPostHeader: React.FC<DetailPostHeaderProps> = ({ post, type }) => {
    const time = formatTimeFromNow(post.postData.createdAt);

    const author = post.postData.author;

    return (
        <Flex 
            w="100%" 
            direction="row" 
            >
            <HStack w="100%" align="center">
                <ProfileImage publicId={author.profileImagePublicId} radiusByPXunit={60}/>
                <Flex mx="10px">
                    <Text fontSize="16px">
                        {author.nickname}
                    </Text>
                </Flex>
                {/* TODO  write 시간 기록하기 동작 에러 확인하기 */}
                {/* <Spacer width="100px" /> */}
                <Text w="80px" noOfLines={1} fontSize="10px">
                    {time}
                </Text>
                <Spacer> </Spacer>
                <PostMenu type={type} post={post}/>
            </HStack>
        </Flex>
    );
};

export default DetailPostHeader;
