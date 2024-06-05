"use client"
import { Flex,Text,Spacer, Button } from "@chakra-ui/react"
import {  CommentClass } from "@/atoms/comment";
import React, { useState } from "react";
import { customColors } from "@/utils/chakra/customColors";
import { mdFontSize } from "@/utils/chakra/fonts";
import CommentMenu from "./commentMenu";
import ReplyToggleButton from "./replyToggleButton";


type CommentProps = {
    commentInstance : CommentClass
    handleReplyButtonClicked : () => void
    isShowReply : boolean
    handleShowReplyIconClicked : () => void
}

/*TODO
- TimeAgo를 지금까지 지나간 시간으로 수정하기 
- Author 길이를 확인하여 축약하여 표출하기
*/
const Comment : React.FC<CommentProps> = ({
    commentInstance,
    handleReplyButtonClicked,
    isShowReply,
    handleShowReplyIconClicked
}) => {
    
    const comment = commentInstance.getComment();
    const content = comment.content;
    const author = comment.author.nickname || comment.author.email;
    const likeCount = comment.likeCount;
    const timeAgo = comment.createdAt.toString();
    const buttonColor = customColors.black[200];
    const hasReplies = commentInstance.isHaveReply();


    return (
        <Flex 
            color={customColors.white[300]} 
            gap= "0.5rem"
            borderRadius={"15px"}
            px={2}
            py={1}
        >
            <Flex width={"10%"} justifyContent={"space-between"} flexDir={"column"} >
                <Text>{author}</Text>
                <Spacer/>
                {hasReplies&&<ReplyToggleButton
                    isShowReply={isShowReply}
                    handleShowReplyIconClicked={handleShowReplyIconClicked}
                    fontSize="1.5rem"
                />}
            </Flex>
            <Flex flexDir={"column"} gap = "0.5rem">
                <Flex>
                    <Text>{timeAgo}</Text>
                    <Spacer />
                    <CommentMenu commentInstance={commentInstance}/>
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