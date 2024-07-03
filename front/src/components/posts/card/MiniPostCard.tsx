'use client';
import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PostType } from '@/type/postType';

type MiniPostCardProps = {
    post: PostType;
    index: number;
};

/*TODO
- onClick 핸들러 구현하기
    - 페이지 이동
    - 프로필 이동
    - 좋아요 표시
- 좋아요 클릭시 Icon 변경하기
*/

const MiniPostCard: React.FC<MiniPostCardProps> = ({ post, index }) => {
    const fontColor = customColors.black[100];
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[100];
    const timeAgo = post.createdAt;
    const router = useRouter();

    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if (title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + '...';
        }
        return title;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        const id = post.id;
        alert('id : ' + id);
        //router.push(`/post/${id}?index=${index}`);
    };

    return (
        <Box
            boxSize={180}
            flexShrink="0"
            border={'1px solid'}
            borderColor={borderColor}
            borderRadius={'15px'}
            bg={bg}
            onClick={handleOnClickItem}
            px="10px"
            py="20px"
            _hover={{ bg: customColors.white[200] }}
            cursor="pointer"
        >
            <Flex w="100%" h="100%" justify={'space-between'} direction={'column'} gap="4px">
                <Flex align={'center'}>
                    <Text
                        fontSize="24px"
                        color={fontColor}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        // text-overflow="ellipsis"
                    >
                        {editTitle(post.title)}
                    </Text>
                </Flex>
                {/* TODO  PostThumbnail 사용하기 */}
                {/* <PostThumbnail publicID={post.cloudinaryPublicId} /> */}
                <Image
                    borderRadius={15}
                    src="https://res.cloudinary.com/dlrsuoog6/image/upload/v1719488420/samples/cup-on-a-table.jpg"
                    alt="miniPost mock url"
                />
            </Flex>
        </Box>
    );
};

export default MiniPostCard;
