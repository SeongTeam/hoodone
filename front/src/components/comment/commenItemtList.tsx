import React from 'react'
import { CommentType } from '@/atoms/comment';
import CommentItem from './commentItem';
import { Flex, Box } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { isLeafCommentOfPage } from '@/lib/server-only/commentLib';
import logger from '@/utils/log/logger';

type CommentItemListProps = {
    comments: CommentType[] | null
    componentDepth: number
}

const CommentItemList : React.FC<CommentItemListProps> = ({ comments, componentDepth}) => {

    if(!comments || comments.length === 0) 
        return null;

    const commentListDepth = comments[0].depth;
    const margin = componentDepth === 0 ? 0 : 4;

    return (
        <Box maxW="100%" pl={margin} overflow="hidden">
        <Flex 
            w="full"
            h="full"
            flexDirection={"column"}  
        >
            {comments.map((comment, index) => {
                    return <CommentItem 
                            key={comment.id} 
                            comment={comment}
                            isWritingOnCurrentPage={ isLeafCommentOfPage(componentDepth,commentListDepth) }
                            childrenReplyList={<CommentItemList comments={comment.replyComments} componentDepth={componentDepth+1}/>} 
                            />
            })}
        </Flex>
        </Box>
    )
}

export default CommentItemList;