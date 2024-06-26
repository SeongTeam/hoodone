"use client"
import { PostType  } from "@/atoms/post";
import { Box, Button, Flex ,IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Spacer} from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import { basicFontSize } from "@/utils/chakra/foundations/fonts";
import { ChatIcon } from "@chakra-ui/icons";
import React , { useCallback } from "react";
import { useRouter } from "next/navigation";
import MotionDiv from "@/components/common/motionDiv";
import PostThumbnail from "./server-component/postThumbnail";
import { Icon } from "@iconify-icon/react";
import UserProfileImage from "@/components/common/server-component/UserProfileImage";

type PostListItemProps = {
    post: PostType;
    index: number;
};

function useStopPropagtion() {
    return useCallback(( e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
}

/*TODO
- 업데이트 시간 YYYY.MM.DD 표시하기
- onClick 핸들러 구현하기
    - 페이지 이동
    - 프로필 이동
    - 좋아요 표시
- 좋아요 클릭시 Icon 변경하기
*/

const variants = {
    hidden : { opacity: 0 },
    visible: { opacity: 1 },
}

const PostListItem: React.FC<PostListItemProps> = ({ 
    post,
    index,
}) => {
    const fontColor = customColors.black[100];
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[100];
    const timeAgo = post.createdAt;
    const buttonColor = customColors.white[100];
    const buttonBg = customColors.purple[100];
    const router = useRouter();

    const isUserFavorite = false;

    const editTitle = (title: string) => {
        const maxTitleLength = 30;
        if(title.length > maxTitleLength) {
            return title.substring(0, maxTitleLength) + "...";
        }
        return title;
    }
    const stopPropagation = useStopPropagtion();
    const handleOnClickItem = (event : React.MouseEvent<HTMLDivElement>) => {
        const id = post.id;
        alert("id : " + id);
        //router.push(`/post/${id}?index=${index}`);
    }

    const handleButtonClick = (event : React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);
        alert("handleButtonClick");
    }

    return (
        <MotionDiv
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ 
                delay: index * 0.1,
                ease: "easeInOut",
                duration: 0.5 
            }}
            viewport={{amount: 0}}
        >
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
                    <PostThumbnail publicID={post.thumbnailPublicID}/>
                    <Flex align={"center"}>
                        <UserProfileImage ImageSrc={post.author.profileImg} />
                        <Text color={fontColor}>
                            {`${post.author.nickname||JSON.stringify(post.author)} ~${timeAgo}`}
                        </Text>
                    </Flex>
                    <Flex justify={"space-between"} >
                        <Button
                            color={buttonColor} 
                            bg={buttonBg}
                            onClick={stopPropagation}
                            _hover = {{bg: customColors.purple[200]}}
                        >
                            Play it!
                        </Button>
                        <Button 
                            leftIcon={ isUserFavorite ?
                                <Icon icon ="solar:heart-bold"  width="20px" height="20px"/> :
                                <Icon icon="solar:heart-linear" width="20px" height="20px"/>}
                            color={buttonColor} 
                            gap="10px"
                            bg={buttonBg}
                            onClick={handleButtonClick}
                            _hover = {{bg: customColors.purple[200]}}
                            >
                                {`${post.likeCount}`}
                        </Button>
                        <Button 
                            leftIcon={<ChatIcon />}
                            color={buttonColor} 
                            gap="10px"
                            bg={buttonBg}
                            _hover = {{bg: customColors.purple[200]}}
                            >
                                {`${post.commentCount}`}
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </MotionDiv>
    );
};

export default PostListItem;