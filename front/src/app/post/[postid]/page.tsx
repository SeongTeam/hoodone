import Post from "@/components/posts/view/server-component/post";
import { NextPage } from "next";
import { PostType } from "@/atoms/post";
import { getPostWithID } from "@/lib/server-only/postLib";
import { Flex } from "@chakra-ui/react";
type PostPageProps = {

    params: {
        postid: string
    }
    searchParams: {
        postPos: string
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
    */
    const post : PostType | null = await getPostWithID(params.postid, parseInt(searchParams.postPos));

    return (
        <Flex w={"full"}>
            <Post post={post} />
        </Flex>
    );
}

export default PostPage;
