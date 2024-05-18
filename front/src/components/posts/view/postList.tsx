import { Flex } from "@chakra-ui/react";
import React from "react";
import { PostType } from "@/atoms/post";
import PostListItem from "./postListItem";
import PostThumbnail from "./server-component/postThumbnail";
import { customColors } from "@/utils/chakra/customColors";

/*TODO
- <PostThumbnail> 컴포넌트 Servercomponent로 활용하기
*/
type PostListProps = {
    postList : PostType[]
}
const PostList : React.FC<PostListProps> = ({
    postList
}) => {
  
  return (

    <Flex 
      flexWrap="wrap" 
      direction="column" 
      align="center" 
      width="100%" 
      gap="1rem"
      >
      {postList.map((post, index) => {
        return (
        <PostListItem post={post} key={post.id} index={index}>
            <PostThumbnail publicID={post.thumbnailPublicID}/>
        </PostListItem>
        );
      }
      )}
    </Flex>
    

  )
} 

export default PostList;