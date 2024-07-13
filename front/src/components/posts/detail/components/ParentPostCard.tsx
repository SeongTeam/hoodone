'use client';

import { PostContainer, QuestPost, SubmissionPost } from '@/type/postType';
import { customColors } from '@/utils/chakra/customColors';
import { Box, Flex, Text, Image, Spacer, Stack, chakra, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import PostThumbnail from '../../card/components/postThumbnail';
import UserProfileImage from '@/components/common/server-component/UserProfileImage';
import { ImageUploadVariant } from '@/components/common/ImageUpload';
import { formatCreatedAt } from '@/lib/Date';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

type PostVariety = 'quest' | 'sb';

type ParentPostCardProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
    type: PostVariety;
};

const ParentPostCard: React.FC<ParentPostCardProps> = (
    { post },
    variant = ImageUploadVariant.Post,
) => {
    const ImagRadious = variant === ImageUploadVariant.Profile ? 'full' : '15px';
    const ImageFit = variant === ImageUploadVariant.Profile ? 'cover' : 'contain';
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
        router.push(`/quest/${id}`);
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

                <Flex
                    py = "10px"
                    px = "10px"
                    align="center"
                    display = {{ base : "none" , md: 'flex' }}
                >
                    {/* 
                        TODO PostThumbnail로 변경하기
                        <PostThumbnail publicID={post.cloudinaryPublicId} /> */}
                    <CldImage
                        src={post.postData.cloudinaryPublicId}
                        alt= "thumbnail"
                        width="270"
                        height="120"
                        style={{ objectFit: ImageFit, borderRadius:  borderRadius  }}
                    />
                </Flex>
            </Stack>
        </Box>
    );
};

export default ParentPostCard;
