import React from 'react'
import { CommentType } from '@/atoms/commen';
import CommentItem from './commentItem';
import { Flex } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';


type CommentItemListProps = {
    comments: CommentType[] | null
    isReplyList : boolean
}

const CommentItemList : React.FC<CommentItemListProps> = ({ comments, isReplyList}) => {
    
    if(!comments || comments.length === 0) 
        return null;

    const m = isReplyList ? 4 : 0

    return (

        <Flex 
            w="full"
            h="full"
            flexDirection={"column"}  
            ml={m} 
        >
            {comments.map((comment, index) => {
                    return <CommentItem 
                            key={comment.id} 
                            comment={comment} 
                            childrenReplyList={<CommentItemList comments={comment.replyComments} isReplyList={true}/>} 
                            />
            })}
        </Flex>
    )
}

export default CommentItemList;