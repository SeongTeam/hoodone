'use client';
import { Flex, Text, Spacer, Button, HStack, Image, Box } from '@chakra-ui/react';
import { CommentClass } from '@/atoms/comment';
import React, { useState } from 'react';
import { customColors } from '@/utils/chakra/customColors';
import { mdFontSize } from '@/utils/chakra/foundations/fonts';
import CommentMenu from './commentMenu';
import ReplyToggleButton from './replyToggleButton';
import { useIsOwner } from '@/hooks/userAccount';
import { SP } from 'next/dist/shared/lib/utils';

type CommentProps = {
    commentInstance: CommentClass;
    handleReplyButtonClicked: () => void;
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
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
}) => {
    const comment = commentInstance.getComment();
    const content = comment.content;
    const author = comment.author.nickname || comment.author.email;
    const likeCount = comment.likeCount;
    const timeAgo = comment.createdAt.toString();
    const buttonColor = customColors.black[200];
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
            <Flex w="100%" direction="row" px="15px">
                <HStack align="center" spacing="6px">
                    <Image
                        borderRadius="full"
                        boxSize="50px"
                        src="https://bit.ly/dan-abramov"
                        alt="Dan Abramov"
                    />
                    <Text color={fontColor} fontSize="12px">
                        UserName
                    </Text>
                    <Text color={fontColor} fontSize="12px">
                        {' ~1h'}
                    </Text>
                    <Text color={fontColor} fontSize="12px">
                        {' ago'}
                    </Text>
                </HStack>
                <Box h={8} w="full" />
                <Box bg="blue" width="80px">
                    <Text> Icon seat</Text>
                    {/* TODO  Charkra Icon 동작 에러 확인하기 */}
                    {/* <StarIcon />
                            <DragHandleIcon /> */}
                </Box>
            </Flex>
            <Text color={fontColor} fontSize="24px">
                {content}
            </Text>
            <HStack spacing={8}>
                {/* like 버튼 */}
                <Button
                    bg={customColors.purple[100]}
                    _hover={{ bg: customColors.white[300] }}
                    borderRadius="8px"
                    width="5em"
                    fontSize="12px"
                    py="20px"
                    px="15px"
                >
                    {/* <AddIcon /> */}
                    1k
                </Button>
                <Button
                    bg={customColors.purple[100]}
                    _hover={{ bg: customColors.white[300] }}
                    borderRadius="8px"
                    width="5em"
                    fontSize="12px"
                    py="20px"
                    px="15px"
                >
                    {/* <AddIcon /> */}
                    1k
                </Button>
                <Button
                    bg={customColors.purple[100]}
                    _hover={{ bg: customColors.white[300] }}
                    borderRadius="8px"
                    width="5em"
                    fontSize="12px"
                    py="20px"
                    px="15px"
                >
                    {/* <AddIcon /> */}
                    reply
                </Button>
            </HStack>
        </Flex>
    );
};

export default Comment;
