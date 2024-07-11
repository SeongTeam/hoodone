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
    const [isImageHidden, setIsImageHidden] = useState(false);
    const updateAt: string = formatCreatedAt(timeAgo);

    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if (title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + '...';
        }
        return title;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        alert('id : ' + id);
        router.push(`/post/${id}`);
    };

    let mockText =
        'qwofodofodjfdkfmdnfmsdnfmndmnfmsndfdpofpsdopfdopfopdofpsodpopdopsofpdoposdpfodpfopdospofpdopsfopodospodpofposdpofdpofpdsopfopd';

    return (
        <VStack spacing={4}>
            <Stack
                spacing={{ base: 0, md: 4 }}
                direction={'row'}
                border="1px solid"
                borderRadius="2px"
                borderColor="gray.400"
                w={{ base: '100%', md: '2xl' }}
                overflow="hidden"
                pos="relative"
                pb="6px"
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
                        >
                            {`Quest:\t`}
                            {editTitle(title)}
                        </Text>
                    </Flex>
                    <Box>
                        <Text noOfLines={2} fontSize="mb" fontWeight="500">
                            {content}
                        </Text>
                    </Box>
                </Stack>

                <Flex
                    h={{ md: '120px', sm: '90px' }}
                    w={{ md: '300px', sm: '250px' }}
                    align="center"
                >
                    {/* 
                        TODO PostThumbnail로 변경하기
                        <PostThumbnail publicID={post.cloudinaryPublicId} /> */}
                    <Image
                        rounded="md"
                        objectFit="fill"
                        src="https://res.cloudinary.com/dk5ug4mzv/image/upload/v1714549154/hoodone/h4tpikvcyqntfuqqhby6.jpg"
                        alt="product image"
                    />
                </Flex>
            </Stack>
        </VStack>
    );
};

export default ParentPostCard;
