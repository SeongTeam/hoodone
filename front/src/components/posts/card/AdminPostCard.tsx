'use client';
import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { PostType } from '@/atoms/post';
import { userAccountState } from '@/atoms/userAccount';
import UserProfileImage from '@/components/common/server-component/UserProfileImage';

type AdminPostCardProps = {
    post: PostType;
    index: number;
    pushedPath: string;
    bg: string;
};

const AdminPostCard: React.FC<AdminPostCardProps> = ({ post, index, pushedPath, bg }) => {
    const fontColor = customColors.black[100];
    // const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[100];
    const timeAgo = post.createdAt;
    const router = useRouter();

    const editTitle = (title: string) => {
        const MAX_TITLE_LENGTH = 20;
        if (title.length > MAX_TITLE_LENGTH) {
            return title.substring(0, MAX_TITLE_LENGTH) + '...';
        }
        return title;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        const id = post.id;
        alert('id : ' + id);
        router.push(pushedPath);
    };

    return (
        <Box
            boxSize={180}
            w="200px"
            flexShrink="0"
            h="110px"
            border={'1px solid'}
            borderColor={borderColor}
            borderRadius={'8px'}
            bg={bg}
            onClick={handleOnClickItem}
            px="15px"
            py="20px"
            _hover={{ bg: customColors.white[200] }}
            cursor="pointer"
        >
            <Flex w="100%" h="100%" direction={'column'} gap="8px">
                <Flex direction={'row'}>
                    <UserProfileImage boxSize="25px" ImageSrc={post.author.profileImagePublicId} />
                    <Text ml="8px" color={fontColor}>{`${post.author.nickname}`}</Text>
                </Flex>
                <Text
                    fontSize="18px"
                    color={fontColor}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                >
                    {editTitle(post.title)}
                </Text>
            </Flex>
        </Box>
    );
};

export default AdminPostCard;
