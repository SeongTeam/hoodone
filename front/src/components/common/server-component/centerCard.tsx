import { Flex,Text } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { getCachedPaginatedPosts } from "@/lib/server-only/postLib";
import { PostType } from "@/atoms/post";
import PostList from "@/components/posts/view/postList";
import LoadMorePosts from "@/components/posts/view/loadMorePosts";

type CenterCardProps = {
    searchInput : object,

}

/*TODO
- <PostList/> 컴포넌트에 Suspense 구현 
    - Post 로딩시, 사용자 경험을 제공하기 위함.
    - ref : https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Infinite scroll 구현하기
    */
const CenterCard: React.FC = async () => {
    const initialPage = 1;
    const postList : PostType[] | null = await getCachedPaginatedPosts(initialPage);
    
    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            pt ="1rem"
            flexDir={"column"}
        >
            {postList && postList.length > 0 ?
                <>
                    <PostList postList={postList}   />
                    <LoadMorePosts/>
                </>
                :<Text>no post</Text>
            }
        </Flex>
    );
}

export default CenterCard;