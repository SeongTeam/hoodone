import React from 'react';
import { CommentClass } from '@/atoms/comment';
import { Box, IconButton, Flex, Text, Spacer } from '@chakra-ui/react';
import { SlPlus, SlMinus } from "react-icons/sl";
import { customColors } from '@/utils/chakra/customColors';

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

type ReplyToggleButtonProps = {
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
    fontSize: string;
};

const ReplyToggleButton: React.FC<ReplyToggleButtonProps> = ({
    isShowReply,
    handleShowReplyIconClicked,
    fontSize
}) => (
    <IconButton
        isRound={true}
        aria-label="Toggle Reply Comments"
        icon={isShowReply ? <SlMinus size={fontSize} /> : <SlPlus size={fontSize} />}
        onClick={handleShowReplyIconClicked}
        size="sm"
        bg="none"
        border="none"
    />
);

export default DeletedCommentItem;