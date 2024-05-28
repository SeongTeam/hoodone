"use client"
import { Flex,Box,Text,Spacer,IconButton, Button } from "@chakra-ui/react"
import { CommentType } from "@/atoms/commen";
import { SlPlus , SlMinus } from "react-icons/sl";
import React, { useState } from "react";
import { customColors } from "@/utils/chakra/customColors";
import { mdFontSize } from "@/utils/chakra/fonts";



type CommentProps = {
    comment : CommentType
    handleReplyButtonClicked : () => void
    isShowReply : boolean
    handleShowReplyIconClicked : () => void
}

/*TODO
- TimeAgo를 지금까지 지나간 시간으로 수정하기 */
const Comment : React.FC<CommentProps> = ({
    comment,
    handleReplyButtonClicked,
    isShowReply,
    handleShowReplyIconClicked
}) => {

    const content = comment.content;
    const author = comment.author.nickname || comment.author.email;
    const likeCount = comment.likeCount;
    const timeAgo = comment.createdAt.toString();
    const buttonColor = customColors.black[200];

    return (
        <Flex 
            color={customColors.white[300]} 
            gap= "0.5rem"
            borderRadius={"15px"}
            px={2}
            py={1}
        >
            <Box>
                <Text>{author}</Text>
                <Spacer/>
                <IconButton
                    hidden= { comment.replyCommentIds.length === 0 }
                    isRound={true}
                    aria-label="Reply Comment"
                    icon={isShowReply ? <SlMinus/> : <SlPlus/>}
                    onClick={handleShowReplyIconClicked}
                />
            </Box>
            <Flex flexDir={"column"} gap = "0.5rem">
                <Flex>
                    <Text>{timeAgo}</Text>
                    <Spacer/>
                    {/*MenuIcon client component*/}
                </Flex>
                <Text fontSize={mdFontSize}>{content}</Text>
                <Flex gap="0.5rem">
                    {/*Button need to be client component */}
                    <Button bg={buttonColor}>{likeCount}</Button>
                    <Button
                        bg={buttonColor}
                        onClick={handleReplyButtonClicked}
                    >Reply</Button>
                </Flex>
            </Flex>
    </Flex>
    );
}

export default Comment;