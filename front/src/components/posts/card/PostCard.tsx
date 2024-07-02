"use client"
import { Box, Button, Flex ,IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Spacer} from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import { basicFontSize } from "@/utils/chakra/foundations/fonts";
import { ChatIcon } from "@chakra-ui/icons";
import React , { useCallback } from "react";
import { useRouter } from "next/navigation";
import MotionDiv from "@/components/common/motionDiv";
import PostThumbnail from "./components/postThumbnail";
import { Icon } from "@iconify-icon/react";
import UserProfileImage from "@/components/common/server-component/UserProfileImage";
import { PostType } from '@/type/postType';
import QuestButtons from "./components/QuestButtons";
import { formatCreatedAt } from "@/lib/Date";

type PostCardProps = {
    post: PostType;
    index: number;
};

/*TODO
- onClick 핸들러 구현하기
    - 페이지 이동
    - 프로필 이동
    - 좋아요 표시
- 좋아요 클릭시 Icon 변경하기
*/

const PostCard: React.FC<PostCardProps> = ({ 
    post,
    index,
}) => {
    const fontColor = customColors.black[100];
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[100];
    const timeAgo = post.createdAt;
    const router = useRouter();

    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if(title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + "...";
        }
        return title;
    }
    const handleOnClickItem = (event : React.MouseEvent<HTMLDivElement>) => {
        const id = post.id;
        alert("id : " + id);
        //router.push(`/post/${id}?index=${index}`);
    }


    return (
        <Box 
            h="440px"
            border={"1px solid"}
            borderColor={borderColor}
            borderRadius={"15px"}
            bg={bg}
            onClick={handleOnClickItem}
            px="10px"
            py="20px"
            _hover = {{bg: customColors.white[200]}}
            cursor="pointer"
        >
            <Flex w="full" h="full" justify={"space-between"} direction={"column"}>
                <Flex align={"center"} >
                    <Text fontSize="24px" color={fontColor}>{editTitle(post.title)}</Text>
                </Flex>
                <PostThumbnail publicID={post.cloudinaryPublicId}/>
                <Flex align={"center"}>
                    <UserProfileImage ImageSrc={post.author.profileImagePublicId} />
                    <Text color={fontColor}>
                        {`${post.author.nickname} ${formatCreatedAt(timeAgo)}`}
                    </Text>
                </Flex>
                <QuestButtons
                    post={post}
                />
            </Flex>
        </Box>
    );
};

export default PostCard;