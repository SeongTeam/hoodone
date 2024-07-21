import InputComment from '../InputComment';
import { Box, Flex, Spinner, Stack, VStack } from '@chakra-ui/react';
import { Suspense } from 'react';
import RootCommentItemList from './rootCommentItemList';
import { POST_TYPE } from '@/type/postType';
import { CommentType } from '@/atoms/comment';
import { CommentFetchService } from '@/lib/server-only/commentLib';
import CommentItem from '../commentItem';

type CommentAreaProps = {
    postType: POST_TYPE;
    postID: number;
    rootCommentID?: number;
};

/*TODO
- commentlist(replylist) 가져올때, pagination 적용하여 부분적으로 가져오기
*/

const CommentArea: React.FC<CommentAreaProps> = ({ postType, postID, rootCommentID }) => {
    const isCommentsPage = rootCommentID === undefined;

    return (
        <Box maxW="100%" overflow="hidden">
            <VStack w="100%" h="full" flexDirection={'column'} gap="10px">
                {isCommentsPage && <InputComment postType={postType} postID={postID} />}
                <Suspense fallback={<LoadingCommentList />}>
                    <RootCommentItemList
                        postType={postType}
                        postID={postID}
                        rootCommentID={rootCommentID}
                    />
                </Suspense>
            </VStack>
        </Box>
    );
};

export default CommentArea;

const LoadingCommentList: React.FC = () => {
    return <Spinner />;
};

type RootCommentItemListProps = {
    postID: number;
    rootCommentID?: number;
    postType : POST_TYPE;
};

const RootCommentItemList: React.FC<RootCommentItemListProps> = async ({
    postID,
    rootCommentID,
    postType,
}) => {
    const isCommentsPage = rootCommentID === undefined;
    const fetchService = new CommentFetchService(postType);

    const comments: CommentType[] | null = isCommentsPage
        ? await fetchService.getInitialComments(postType, postID)
        : [await fetchService.getCommentsWithReply(postID, rootCommentID)];

    if (!comments || comments.length === 0) return null;

    const rootComponentDepth  = fetchService.rootComponentDepth;
    const commentListDepth = comments[0].depth;

    return (
        <Box w="100%" px="12px" py="4px" overflow="hidden">
            <Flex w="full" h="full" flexDirection={'column'}>
                {comments.map((comment, index) => {
                    return (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            isWritingOnCurrentPage={fetchService.isLeafCommentOfPage(
                                rootComponentDepth,
                                commentListDepth,
                            )}
                            postType={postType}
                            childrenReplyList={
                                <CommentItemList
                                    postType={postType}
                                    comments={comment.replyComments}
                                    componentDepth={rootComponentDepth + 1}
                                />
                            }
                        />
                    );
                })}
            </Flex>
        </Box>
    );
};


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