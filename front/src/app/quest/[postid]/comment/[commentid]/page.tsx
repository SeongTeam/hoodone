import { NextPage } from "next";
import { getPostWithID } from "@/lib/server-only/postLib";
import { PostType } from "@/atoms/post";
import { Flex } from "@chakra-ui/react";
import logger from "@/utils/log/logger";
import Post from "@/components/posts/view/server-component/post";

type PostPageWithReplyProps = {
    params: {
        postid: string,
        commentid : string
    }
    searchParams: {
        index: string,
    }
}
const PostPageWithReply : NextPage<PostPageWithReplyProps> = async (
{
    params,
    searchParams
}
) => {
    const post : PostType | null = await getPostWithID(params.postid, parseInt(searchParams.index));
    logger.info('#PostPageWithReply Rendered', { message: JSON.stringify(params) });
    if(!post ) {
        logger.error(`post${params.postid} not found`);
        throw new ReferenceError(`post not found`);
    }

    return (
        <Flex w={"full"} flexDir={"column"}>
            <Post post={post} rootCommentID={parseInt(params.commentid)}/>
        </Flex>
    );



}

export default PostPageWithReply;