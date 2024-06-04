import React from 'react'
import { Box, Flex } from "@chakra-ui/react";
import CommentItem from '../commentItem';
import { CommentType } from '@/atoms/comment';
import { getInitialComments, getCommentsWithReply, getCommentListConfig, isLeafCommentOfPage} from '@/lib/server-only/commentLib';
import CommentItemList from './commenItemtList';

type RootCommentItemListProps = {
    postID: number;
    rootCommentID? : number;
}

const RootCommentItemList: React.FC<RootCommentItemListProps> = async ({
    postID,
    rootCommentID
}) => {
    const isCommentsPage = rootCommentID === undefined;
    
    const comments : CommentType[] | null = isCommentsPage ? await getInitialComments(postID)
    : [ await getCommentsWithReply(postID, rootCommentID) ];

    if(!comments || comments.length === 0) 
        return null;

    const { rootComponentDepth } = getCommentListConfig();
    const commentListDepth = comments[0].depth;

    return (
        <Box maxW="100%" overflow="hidden">
            <Flex 
                w="full"
                h="full"
                flexDirection={"column"}  
            >
                {comments.map((comment, index) => {
                        return <CommentItem 
                                key={comment.id} 
                                comment={comment}
                                isWritingOnCurrentPage={ isLeafCommentOfPage(rootComponentDepth,commentListDepth) }
                                childrenReplyList={<CommentItemList comments={comment.replyComments} componentDepth={rootComponentDepth+1}/>} 
                                />
                })}
            </Flex>
        </Box>
    )
}

export default RootCommentItemList;