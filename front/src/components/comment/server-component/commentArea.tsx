import InputComment from "../InputComment";
import { Box, Flex, Spinner  } from "@chakra-ui/react";
import { Suspense } from "react";
import RootCommentItemList from "./rootCommentItemList";


type CommentAreaProps = {
    postID : number,
    rootCommentID? : number,
}

/*TODO
- commentlist(replylist) 가져올때, pagination 적용하여 부분적으로 가져오기
*/
const CommentArea: React.FC<CommentAreaProps> = async ({postID, rootCommentID}) => {
    
    const isCommentsPage = rootCommentID === undefined;

    return (
        <Box maxW="100%" overflow="hidden">
            <Flex w="full" h="full" flexDirection={"column"} gap="1rem">
                { isCommentsPage && <InputComment/>}
                <Suspense fallback={<LoadingCommentList/>}>
                    <RootCommentItemList postID={postID} rootCommentID={rootCommentID}/>
                </Suspense>
            </Flex>
        </Box>
    )
}

export default CommentArea;


const LoadingCommentList : React.FC = () => {

    return (
        <Spinner />
    );
}
