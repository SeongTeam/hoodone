"use client"
import { CommentType } from '@/atoms/commen';
import React, { useState} from 'react';
import { Flex,  } from '@chakra-ui/react'
import { customColors } from '@/utils/chakra/customColors';
import Comment from './comment';
import CommentItemList from './commenItemtList';
import InputReply from './InputReply';

/*TODO
- 버그 수정
    bug ) reply가 없는 최상위 코멘트에는 reply 버튼 클릭해도 inputReply 미출력됨
*/
type CommentItemProps = {
    comment: CommentType,
    padding : number,

}
const CommentItem : React.FC<CommentItemProps> = ({
    comment ,
    padding,
}) => {
    const bg = customColors.black[200];
    const [commentData, setCommentData] = useState<CommentType>(comment);
    const [isShowICon, setIsShowICon] = useState(false);
    const [isShowReply, setIsShowReply] = useState(false);
    const [isWriteReply, setIsWriteReply] = useState(false);

    const handleShowReply = () => {
        if(commentData.replyComments && commentData.replyComments.length > 0){
            setIsShowReply(!isShowReply);
        }
        else{
            alert("move page for read more reply");
        }
    }

    const handleWriteReply = () => {
        if(commentData.replyComments && commentData.replyComments.length > 0){
            setIsWriteReply(!isWriteReply);
        }
        else{
            alert("move page for write reply");
        }

    }

    const handleCancelReply = () => {
        setIsWriteReply(!isWriteReply);
    }

    const handleAddReply = (newReply : CommentType) => {
        console.log("handleSendReply is clicked");
        
        setCommentData( (prev) => ({...prev, replyComments: [...prev.replyComments, newReply]}))
    }

    

    return (
        <Flex w="full" bg={bg} flexDir={"column"}>
            <Comment 
                comment={commentData} 
                handleReplyButtonClicked={handleWriteReply}
                handleShowReplyIconClicked={handleShowReply}
                isShowReply={isShowReply}
            />
            {isWriteReply && <InputReply handleAddReply={handleAddReply} handleCancelReply= {handleCancelReply}parentComment={commentData}/>}
            {isShowReply 
                && 
                <CommentItemList 
                padding={padding + 2}
                comments = {commentData.replyComments}
                />
            }
        </Flex>
    );
}

export default CommentItem;