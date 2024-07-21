import React from "react";
import { Box } from "@chakra-ui/react";
import PostWinow from "@/components/posts/card/PostWindow";
import { POST_TYPE } from "@/components/posts/postType";
import { customColors } from "@/utils/chakra/customColors";
export default function QuestPage() {

    return (
        <Box>
            <PostWinow type={POST_TYPE.QUEST}/>
        </Box>
    )
}