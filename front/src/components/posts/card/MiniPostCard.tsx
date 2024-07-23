'use client';
import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { POST_TYPE, PostContainer,QuestPost , SubmissionPost } from '@/components/posts/postType';
import PostThumbnail from './components/postThumbnail';
import { RouteTable } from '@/components/sidebar/SideBarRoute';

type MiniPostCardProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
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
    const timeAgo = post.postData.createdAt;
    const router = useRouter();

    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if (title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + '...';
        }
        return title;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        let path = '';

        switch (post.postData.type) {
            case POST_TYPE.QUEST:
                path = RouteTable.QuestRoute.getDetail(post.postData.id.toString());
                break;
            case POST_TYPE.SB:
                path = RouteTable.SubmissionRoute.getDetail(post.postData.id.toString());
                break;

            default:
                path = '/';

        }

        router.push(`${path}`);
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
                        {editTitle(post.postData.title)}
                    </Text>
                </Flex>

                <PostThumbnail publicID={post.postData.cloudinaryPublicId} />
            </Flex>
        </Box>
    );
};

export default MiniPostCard;
