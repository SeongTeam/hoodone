'use client';
import { Box, Flex, Menu, MenuButton, Text, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MotionDiv from '@/components/common/motionDiv';
import PostThumbnail from './components/postThumbnail';
import UserProfileImage from '@/components/common/server-component/UserProfileImage';
import QuestButtons from './components/QuestButtons';
import { formatCreatedAt } from '@/lib/Date';
import { PostContainer,QuestPost, SubmissionPost, POST_TYPE } from '@/components/posts/postType';
import { RouteTable } from '@/components/sidebar/SideBarRoute';


type PostCardProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
    index: number;
    type: POST_TYPE;
};

/*TODO
- onClick 핸들러 구현하기
    - 페이지 이동
    - 프로필 이동
    - 좋아요 표시
- 좋아요 클릭시 Icon 변경하기
*/

const PostCard: React.FC<PostCardProps> = ({ post, index, type }) => {
    const fontColor = customColors.black[100];
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[100];
    const timeAgo = post.postData.createdAt;
    const router = useRouter();
    const {author } = post.postData;
    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if (title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + '...';
        }
        return title;
    };
    const handleOnClickItem = (event: React.MouseEvent<HTMLDivElement>) => {
        const id = post.postData.id;
        let route = '';
        switch (type) {
            case POST_TYPE.QUEST:
                route = RouteTable.QuestRoute.getDetail(id.toString());
                break;
            case POST_TYPE.SB:
                route = RouteTable.SubmissionRoute.getDetail(id.toString());
                break;
        }
        alert('id : ' + id);
        router.push(`${route}?index=${index}`);
    };

    return (
        <Box
            h="440px"
            maxW="340px"
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
            <Flex w="full" h="full" justify={'space-between'} direction={'column'}>
                <Flex align={'center'}>
                    <Text fontSize="24px" color={fontColor}>
                        {editTitle(post.postData.title)}
                    </Text>
                </Flex>
                <PostThumbnail publicID={post.postData.cloudinaryPublicId} />
                <Flex align={'center'}>
                    <UserProfileImage ImageSrc={author.profileImagePublicId} />
                    <Text ml="10px" color={fontColor}>
                        {`${author.nickname} ${formatCreatedAt(timeAgo)}`}
                    </Text>
                </Flex>
                <QuestButtons post={post} />
            </Flex>
        </Box>
    );
};

export default PostCard;
