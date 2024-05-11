import { Flex } from "@chakra-ui/react";
import React from "react";
import { getAllPosts } from "@/app/server-actions/postsActions";
import { PostType } from "@/atoms/post";
import PostList from "@/components/posts/view/postList";

type CenterCardProps = {
    searchInput : object,

}
const CenterCard: React.FC = async () => {

    const postList : PostType[] = await getAllPosts();
    
    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            pt ="1rem"
        >
            <PostList postList={postList}   />
            
        </Flex>
    );
}

export default CenterCard;