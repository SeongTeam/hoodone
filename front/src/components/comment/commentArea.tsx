import InputComment from "./InputComment";
import CommentItemList from "./commenItemtList";
import { CommentType } from "@/atoms/commen";
import { Flex } from "@chakra-ui/react";
import { getCommenWithRange } from "@/lib/server-only/commentLib";


type CommentAreaProps = {
    postID : number,
}


const CommentArea: React.FC<CommentAreaProps> = async ({postID,}) => {
    
    const rootCommentID = 0;
    const limit = 3;
    const comments : CommentType[] | null = await getCommenWithRange(postID, rootCommentID, limit);
    
    
    return (
        <Flex w="full" h="full" flexDirection={"column"} gap="1rem">
            <InputComment/>
            <CommentItemList comments={comments} isReplyList={false}/>
        </Flex>
    )
}

export default CommentArea;
