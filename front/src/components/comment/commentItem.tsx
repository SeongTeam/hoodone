"use client"
import { CommentType } from '@/atoms/commen';
import React, { useState} from 'react';
import { Flex,  } from '@chakra-ui/react'
import { customColors } from '@/utils/chakra/customColors';
import Comment from './comment';
import InputReply from './InputReply';

/*TODO
- 버그 수정
    bug ) reply가 없는 최상위 코멘트에는 reply 버튼 클릭해도 inputReply 미출력됨
*/
type CommentItemProps = {
    comment: CommentType,
    childrenReplyList: React.ReactNode,

}
const CommentItem : React.FC<CommentItemProps> = ({
    comment ,
    childrenReplyList,
}) => {
    const borderColor = customColors.strokeColor[100];
    const [isShowReply, setIsShowReply] = useState(false);
    const [isWriteReply, setIsWriteReply] = useState(false);

    const handleShowReply = () => {
        if(comment.replyComments && comment.replyComments.length > 0){
            setIsShowReply(!isShowReply);
        }
        else{
            alert("move page for read more reply");
        }
    }

    const handleWriteReply = () => {
        if(comment.replyComments && comment.replyComments.length > 0){
            setIsWriteReply(!isWriteReply);
        }
        else{
            alert("move page for write reply");
        }

    }

    const handleCancelReply = () => {
        setIsWriteReply(false);
    }

    const handleAddReply = () => {
        setIsWriteReply(false);
        setIsShowReply(true);
    }

    

    return (
        <Flex 
            w="full"
            flexDir={"column"}
            borderRadius={"15px"}
            borderLeft={`3px solid ${borderColor}`}
            gap={"0.5rem"}
            p={2}
        >
            <Comment 
                comment={comment} 
                handleReplyButtonClicked={handleWriteReply}
                handleShowReplyIconClicked={handleShowReply}
                isShowReply={isShowReply}
            />
            {isWriteReply && <InputReply handleAddReply={handleAddReply} handleCancelReply= {handleCancelReply} parentComment={comment}/>}
            {isShowReply 
                && 
                childrenReplyList
            }
        </Flex>
    );
}

export default CommentItem;