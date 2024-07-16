import React from 'react';
import { CommentClass } from '@/type/commentType';
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
            borderRadius="15px"
            bg={customColors.gray[300]}
            px="10px"
            pt="10px"
            pb="5px"
            flexDir="column"
            mb="5px"
        >
            <Flex alignItems="center">
                <Text fontSize={fontSize}>Deleted</Text>
                <Spacer />
            </Flex>
            <Box h="30px">
                <Box
                    visibility={hasReplies ? 'visible' : 'hidden'}>
                    <ReplyToggleButton
                        isShowReply={isShowReply}
                        handleShowReplyIconClicked={handleShowReplyIconClicked}
                    />
                </Box>
            </Box>
        </Flex>
    );
};

export default DeletedCommentItem;