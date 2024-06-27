"use client"
import React, { useCallback } from "react";
import { Flex, Button } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { customColors } from "@/utils/chakra/customColors";
import { PostType } from "@/atoms/post";
import { ChatIcon } from "@chakra-ui/icons";

type QuestButtonsProps = {
    post : PostType;
}

function useStopPropagtion() {
    return useCallback(( e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
}

const QuestButtons : React.FC<QuestButtonsProps> = ({ post }) => {

    
    const buttonColor = customColors.white[100];
    const buttonBg = customColors.purple[100];

    /*TODO
    - UserAccount atom에서 isFavorite 정보 가져오기.
    */
    const isUserFavorite = false;

    const stopPropagation = useStopPropagtion();

    const handleButtonClick = (event : React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);
        alert("handleButtonClick");
    }

    return (
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
                {`${post.favoriteCount}`}
        </Button>
        <Button 
            leftIcon={<ChatIcon />}
            color={buttonColor} 
            gap="10px"
            bg={buttonBg}
            _hover = {{bg: customColors.purple[200]}}
            >
                {`${post.comments.length}`}
        </Button>
    </Flex>
    );
}

export default QuestButtons;