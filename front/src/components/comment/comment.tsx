'use client';
import { Flex, Text, Spacer, Button, HStack, Image, Box } from '@chakra-ui/react';
import { CommentClass } from '@/type/commentType';
import React, { useState } from 'react';
import { customColors } from '@/utils/chakra/customColors';
import { mdFontSize } from '@/utils/chakra/foundations/fonts';
import CommentMenu from './commentMenu';
import ReplyToggleButton from './replyToggleButton';
import { useIsOwner } from '@/hooks/userAccount';
import { SP } from 'next/dist/shared/lib/utils';
import { ProfileImage } from '../common/ProfileImage';
import { formatCreatedAt } from '@/lib/Date';
import { POST_TYPE } from '@/components/posts/postType';

type CommentProps = {
    commentInstance: CommentClass;
    handleReplyButtonClicked: () => void;
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
    postType : POST_TYPE
    postId : number
};

/*TODO
- TimeAgo를 지금까지 지나간 시간으로 수정하기 
- Author 길이를 확인하여 축약하여 표출하기
*/
const Comment: React.FC<CommentProps> = ({
    commentInstance,
    handleReplyButtonClicked,
    isShowReply,
    handleShowReplyIconClicked,
    postType,
    postId,
}) => {
    const comment = commentInstance.getComment();
    const content = comment.content;
    const nickname = comment.author.nickname;
    const hasReplies = commentInstance.isHaveReply();
    const isCommentOwner = useIsOwner(comment.author.nickname);
    const fontColor = customColors.black[100];
    return (
        <Flex
            color={customColors.white[300]}
            bg={customColors.white[100]}
            gap="0.5rem"
            borderRadius={'15px'}
            px={4}
            py={2}
            border={isCommentOwner ? '1px solid' : 'none'}
            borderColor={isCommentOwner ? customColors.white[100] : 'none'}
            borderLeft="none"
            flexDir={'column'}
        >
            <Flex w="100%" direction="row" px="15px" justify="space-between">
                <HStack align="center" spacing="6px"  >
                    <ProfileImage
                        publicId={comment.author.profileImagePublicId}
                        radiusByPXunit={40}
                    />
                    <Text color={fontColor} fontSize="12px">
                        {nickname}
                    </Text>
                    <Text color={fontColor} fontSize="12px">
                        {formatCreatedAt(comment.createdAt)}
                    </Text>
                </HStack>
                <CommentMenu commentInstance={commentInstance} postType={postType} postId={postId}/>
            </Flex>
            <Text color={fontColor} fontSize="20px">
                {content}
            </Text>
            <HStack spacing={8}>
                <Box
                    id="ReplyToggleButton"
                    visibility= {hasReplies ? 'visible' : 'hidden'}
                >
                    <ReplyToggleButton
                        isShowReply={isShowReply}
                        handleShowReplyIconClicked={handleShowReplyIconClicked}
                        />
                </Box>
                <Button
                    id="UpVoteButton"
                    variant="purple"
                    fontSize="16px"
                    w="80px"
                    py="20px"
                    px="15px"
                >
                    {comment.likeCount}
                </Button>
                <Button
                    id="replyButton"
                    variant="purple"
                    fontSize="16px"
                    w="80px"
                    py="20px"
                    px="15px"
                    onClick={handleReplyButtonClicked}
                >
                    reply
                </Button>
            </HStack>
        </Flex>
    );
};

export default Comment;
