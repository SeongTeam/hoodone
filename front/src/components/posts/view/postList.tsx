import { Flex } from "@chakra-ui/react";
import React from "react";
import { PostType } from "@/atoms/post";
import PostListItem from "./postListItem";
import PostThumbnail from "./server-component/postThumbnail";
import { customColors } from "@/utils/chakra/customColors";
import { Grid, GridItem } from "@chakra-ui/react";

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

    <Grid 
      templateColumns="repeat(auto-fill,minmax(250px,1fr))"
      gap ="20px"
      width="100%"
      >
      {postList.map((post, index) => {
        return (
          <GridItem key = {post.id} maxW="340px">
            <PostListItem post={post} key={post.id} index={index}/>
          </GridItem>
        );
      }
      )}
    </Grid>
    

  )
} 

export default PostList;