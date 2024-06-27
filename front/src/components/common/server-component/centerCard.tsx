import { Flex,Text } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { getCachedPaginatedPosts } from "@/lib/server-only/postLib";
import { PostType } from "@/atoms/post";
import PostList from "@/components/posts/view/postList";
import LoadMorePostCards from "@/components/posts/card/LoadMorePostCards";


/*TODO
- <PostList/> 컴포넌트에 Suspense 구현 
    - Post 로딩시, 사용자 경험을 제공하기 위함.
    - ref : https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Infinite scroll 구현하기
    */
const CenterCard: React.FC = async () => {
    
    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            pt ="1rem"
            flexDir={"column"}
        >
            <LoadMorePostCards />
        </Flex>
    );
}

export default CenterCard;