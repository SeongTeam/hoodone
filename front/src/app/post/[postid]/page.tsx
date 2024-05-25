import Post from "@/components/posts/view/server-component/post";
import { NextPage } from "next";
import { PostType } from "@/atoms/post";
import { getPostWithID } from "@/lib/server-only/postLib";
import { Flex } from "@chakra-ui/react";
import logger from "@/utils/log/logger";
import CommentItemList from "@/components/comment/commenItemtList";
import { CommentType } from "@/atoms/commen";
import { getCommenWithRange } from "@/lib/server-only/commentLib";
type PostPageProps = {

    params: {
        postid: string
    }
    searchParams: {
        index: string
    }
}

const PostPage : NextPage<PostPageProps>  = async ( {
    params,
    searchParams
}) => {
    /* TODO
    - 2가지 시나리오에 대한 post data cache 고려하기
        1. post list item 클릭 > 해당 페이지 진입
        2. url 링크를 통해 해당 페이지 진입
    - comment 로드 실패시에 대한 UI 구현하기 (fall back UI)
    - comment 로등 동안 표출될 UI 구현하기 ( suspense)
    - commentlist 업데이트 시 revalidate에 의해 PostPage가 RE-SSR되는 현상 최적화 하기 
    */
   logger.info('#PostPage Rendered', { message: params.postid });

    const post : PostType | null = await getPostWithID(params.postid, parseInt(searchParams.index));
    const rootCommentID = 0;
    const limit = 3;
    const comments : CommentType[] | null = await getCommenWithRange(parseInt(params.postid), rootCommentID, limit);
    
    if(!post || !comments) {
        logger.error(`post${params.postid} or comment not found`);
        throw new ReferenceError(`post or comment not found`);
    }

    return (
        <Flex w={"full"} flexDir={"column"}>
            <Post post={post} commentList={comments} />
        </Flex>
    );
}

export default PostPage;
