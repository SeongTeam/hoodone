import React from 'react'
import { CommentType } from '@/atoms/commen';
import CommentItem from './commentItem';
import { Flex } from '@chakra-ui/react';


type CommentItemListProps = {
    comments: CommentType[] | null
    padding? : number
}

const CommentItemList : React.FC<CommentItemListProps> = ({ comments, padding}) => {
    
    if(!comments || comments.length === 0) 
        return null;

    const p = padding ? padding : 0

    return (

        <Flex w="full" h="full" flexDirection={"column"} gap="1rem" pl={padding}>
            {comments.map((comment, index) => {
                    return <CommentItem key={comment.id} comment={comment} childrenReplyList={<CommentItemList comments={comment.replyComments} padding={p+2}/>} />
            })}
        </Flex>
    )
}

export default CommentItemList;