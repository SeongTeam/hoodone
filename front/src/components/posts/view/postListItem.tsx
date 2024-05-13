"use client"
import { PostType, postState  } from "@/atoms/post";
import { Button, Flex ,IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Spacer} from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import { basicFontSize } from "@/utils/chakra/fonts";
import { HamburgerIcon, ArrowDownIcon,ArrowUpIcon , ChatIcon } from "@chakra-ui/icons";
import React from "react";
import { useRouter } from "next/navigation";
import PostMenu from "./postMenu";

type PostListItemProps = {
    post: PostType;
    children: React.ReactNode;
};

/*TODO
- 업데이트 시간 표준 규정하기
    - nest Server와 next Server 시간 중 선택
*/

const PostListItem: React.FC<PostListItemProps> = ({ 
    post,
    children }) => {
    const fontColor = customColors.white[300];
    const bg = customColors.black[200];
    const borderColor = customColors.strokeColor[100];
    const timeAgo = post.createdAt;
    const isShowDelete = false;
    const buttonColor = customColors.black[300];
    const router = useRouter();

    const handleOnClickItem = () => {
        const id = post.id;
        router.push(`/post/${id}`);
    }

    return (
        <Flex 
        w= "full"
        border={"1px solid"}
        borderColor={borderColor}
        borderRadius={"15px"}
        px="1rem"
        py="0.25rem"
        justify={"space-between"}
        bg={bg}
        onClick={handleOnClickItem}
        >
            {children}
            <Flex paddingLeft={"1rem"} w="full" flexDirection={"column"}>
                <Flex>
                    <Text color={fontColor}>
                        {`${post.author.nickname||JSON.stringify(post.author)} ~${timeAgo}`}
                        </Text>
                    <Spacer/>
                    <PostMenu post={post}/>
                </Flex>
                <Text fontSize={basicFontSize} color={fontColor}>{post.title}</Text>
                <Flex gap="0.5rem">
                    <Button 
                        leftIcon={<ArrowUpIcon />}
                        rightIcon={<ArrowDownIcon />}
                        color={fontColor} 
                        bg={buttonColor}>
                            {`${post.likeCount}`}
                    </Button>
                    <Button 
                        leftIcon={<ChatIcon />}
                        color={fontColor} 
                        bg={buttonColor}>
                            {`${post.commentCount}`}
                        </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostListItem;