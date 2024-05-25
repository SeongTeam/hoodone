import React from 'react'
import { CommentType } from '@/atoms/commen';
import CommentItem from './commentItem';
import { Flex } from '@chakra-ui/react';


type CommentItemListProps = {
    comments: CommentType[]
    padding? : number
}

const CommentItemList : React.FC<CommentItemListProps> = ({ comments, padding}) => {
    console.log("commentList", comments.length);
    const p = padding ? padding : 0
    return (
        <Flex w="full" h="full" flexDirection={"column"} gap="1rem" pl={padding}>
            {comments.map((comment, index) => {
                    return <CommentItem key={comment.id} comment={comment} padding={p} />
            })}
        </Flex>
    )
}

export default CommentItemList;