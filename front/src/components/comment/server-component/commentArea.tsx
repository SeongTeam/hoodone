import InputComment from '../InputComment';
import { Box, Flex, Spinner, Stack, VStack } from '@chakra-ui/react';
import { Suspense } from 'react';
import RootCommentItemList from './rootCommentItemList';

type CommentAreaProps = {
    postID: number;
    rootCommentID?: number;
};

/*TODO
- commentlist(replylist) 가져올때, pagination 적용하여 부분적으로 가져오기
*/
const CommentArea: React.FC<CommentAreaProps> = ({ postID, rootCommentID }) => {
    const isCommentsPage = rootCommentID === undefined;

    return (
        <Box maxW="100%" overflow="hidden">
            <VStack w="100%" h="full" flexDirection={'column'} gap="1rem">
                {isCommentsPage && <InputComment />}
                <Suspense fallback={<LoadingCommentList />}>
                    <RootCommentItemList postID={postID} rootCommentID={rootCommentID} />
                </Suspense>
            </VStack>
        </Box>
    );
};

export default CommentArea;

const LoadingCommentList: React.FC = () => {
    return <Spinner />;
};
