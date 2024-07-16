import React from 'react'
import { CommentType } from '@/type/commentType';
import CommentItem from '../commentItem';
import { Flex, Box } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { CommentFetchService } from '@/lib/server-only/commentLib';
import logger from '@/utils/log/logger';
import { POST_TYPE } from '@/components/posts/postType';

type CommentItemListProps = {
    comments: CommentType[] | null
    componentDepth: number
    postType: POST_TYPE
}

const CommentItemList : React.FC<CommentItemListProps> = ({ comments, postType ,componentDepth}) => {

    if(!comments || comments.length === 0) 
        return null;

    const commentListDepth = comments[0].depth;
    const margin = componentDepth === 0 ? 0 : 8;
    const commentService = new CommentFetchService(postType);

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
                            isWritingOnCurrentPage={ commentService.isLeafCommentOfPage(componentDepth,commentListDepth) }
                            childrenReplyList={<CommentItemList comments={comment.replyComments} componentDepth={componentDepth+1} postType={postType}/>} 
                            postType= {postType}
                            />
            })}
        </Flex>
        </Box>
    )
}

export default CommentItemList;