import InputComment from "./InputComment";
import CommentItemList from "./commenItemtList";
import { CommentType} from "@/atoms/commen";
import { Flex } from "@chakra-ui/react";
import { getInitialComments, getCommentsWithReply, getCommentListConfig } from "@/lib/server-only/commentLib";
import logger from "@/utils/log/logger";


type CommentAreaProps = {
    postID : number,
    rootCommentID? : number,
}

/*TODO
- commentlist(replylist) 가져올때, pagination 적용하여 부분적으로 가져오기
*/
const CommentArea: React.FC<CommentAreaProps> = async ({postID, rootCommentID}) => {
    
    logger.info("CommentArea", { postID, rootCommentID });
    const isCommentsPage = rootCommentID === undefined;
    
    const comments : CommentType[] | null = isCommentsPage ? await getInitialComments(postID)
    : [ await getCommentsWithReply(postID, rootCommentID) ];

    const { rootComponentDepth } = getCommentListConfig();

    return (
        <Flex w="full" h="full" flexDirection={"column"} gap="1rem">
            { isCommentsPage ? 
                <InputComment/>
            : null}
                <CommentItemList comments={comments} componentDepth={rootComponentDepth}/>
        </Flex>
    )
}

export default CommentArea;
