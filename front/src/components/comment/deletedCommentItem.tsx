import React from 'react';
import { CommentClass } from '@/atoms/comment';
import { Box, Flex, Text, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import ReplyToggleButton from './replyToggleButton';

type DeletedCommentProps = {
    commentInstance: CommentClass;
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
};

const DeletedCommentItem: React.FC<DeletedCommentProps> = ({
    commentInstance,
    isShowReply,
    handleShowReplyIconClicked
}) => {
    const fontSize = '1.5rem';
    const hasReplies = commentInstance.isHaveReply();

    return (
        <Flex
            color={customColors.white[300]}
            gap="0.5rem"
            borderRadius="15px"
            px={2}
            pt={5}
            pb={1}
            bg={customColors.black[200]}
            flexDir="column"
        >
            <Flex gap="0.5rem" alignItems="center">
                <Text fontSize={fontSize}>Deleted</Text>
                <Spacer />
            </Flex>
            <Box h="2rem">
                {hasReplies && (
                    <ReplyToggleButton
                        isShowReply={isShowReply}
                        handleShowReplyIconClicked={handleShowReplyIconClicked}
                        fontSize={fontSize}
                    />
                )}
            </Box>
        </Flex>
    );
};

export default DeletedCommentItem;