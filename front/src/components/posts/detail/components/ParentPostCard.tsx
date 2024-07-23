'use client';

import { POST_TYPE, PostContainer, QuestPost, SubmissionPost } from '@/components/posts/postType';
import { customColors } from '@/utils/chakra/customColors';
import { Box, Flex, Text, Image, Spacer, Stack, chakra, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import PostThumbnail from '../../card/components/postThumbnail';
import UserProfileImage from '@/components/common/server-component/UserProfileImage';
import { ImageUploadVariant } from '@/components/common/ImageUpload';
import { formatCreatedAt } from '@/lib/Date';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { RouteTable } from '@/components/sidebar/SideBarRoute';


type ParentPostCardProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
    type: POST_TYPE;
};

const ParentPostCard: React.FC<ParentPostCardProps> = (
    { post, type },
) => {
    
    const { id ,title, content, author, createdAt, tags } = post.postData;

    const timeAgo = createdAt;
    const router = useRouter();
    const maxTitleLength = 30;
    const maxContentLength = 200;
    const updateAt: string = formatCreatedAt(timeAgo);
    const borderRadius = '15px';

    const editString = (str: string, maxLength : number) => {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        router.push(RouteTable.QuestRoute.getDetail(id.toString()));
    };



    return (
        <Box>
            <Stack
                spacing={{ base: 0, md: 4 }}
                direction={'row'}
                border="1px solid"
                borderRadius={borderRadius}
                borderColor={customColors.shadeLavender[100]}
                bg="white"
                w="full"
                overflow="hidden"
                pos="relative"
                mb = "10px"
                onClick={handleOnClickItem}
                _hover = {{ bg: customColors.shadeLavender[300] }}
                cursor={'pointer'}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    w="100%"
                    px={4}
                    mt={{ base: '5px !important', sm: 0 }}
                >
                    <Flex justifyContent="space-between">
                        <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            fontFamily={'Roboto'}
                        >
                            {`Quest:\t`}
                            {editString(title, maxTitleLength)}
                        </Text>
                    </Flex>
                    <Box>
                        <Text noOfLines={2} fontSize="mb" fontWeight="500">
                            {editString(content, maxContentLength)}
                        </Text>
                    </Box>
                </Stack>

                <Box
                    py = "10px"
                    px = "10px"
                    display = {{ base : "none" , md: 'block' }}
                    w="200px"
                >
                    <PostThumbnail 
                        heightPX = {100} 
                        publicID={post.postData.cloudinaryPublicId} 
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default ParentPostCard;
