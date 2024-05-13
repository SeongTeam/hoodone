import { PostType } from "@/atoms/post";
import React from "react";
import { Card, CardBody, CardFooter, CardHeader, Flex,Spacer ,Text } from "@chakra-ui/react";
import { basicFontSize } from "@/utils/chakra/fonts";
import { customColors } from "@/utils/chakra/customColors";
import  htmlReactParser  from "html-react-parser";
import PostMenu from "../postMenu";

type PostProps = {
    post: PostType | null
}

const Post: React.FC<PostProps> = ({post}) => {
    const bg = customColors.black[300];
    const fontColor = customColors.white[300];
    console.log("post Author", post?.author);
    return (

        post === null ? (
            <div>no post</div>
        ) : (

            <Card w="full" bg={bg} borderRadius={"15px"} 
                border={"1px solid"}
                borderColor={customColors.strokeColor[100]}>
                <CardHeader> 
                    <Flex>
                        <Text color={fontColor}>{`${post.author.nickname} ~~ ${post.createdAt}`}</Text>
                        <Spacer/>
                        <PostMenu post={post}/>
                    </Flex>
                    {/*<PostHeader/> */}
                    <Text color={customColors.white[100]} fontSize={basicFontSize}>{post.title}</Text>
                </CardHeader>
                <CardBody mx="1rem">
                        <Flex color={fontColor} flexDirection={"column"}>
                            {htmlReactParser(post.content)}
                        </Flex>
                </CardBody>
                <CardFooter>
                    {/*<Comment/>*/}
                    <Text color={fontColor}>commentList</Text>
                </CardFooter>
            </Card>
        )


    )
};

export default Post