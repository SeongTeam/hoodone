import React from "react";
import { Box } from "@chakra-ui/react";
import PostWinow from "@/components/posts/card/PostWindow";
import { POST_TYPE } from "@/type/postType";
export default function SubmissionsPage() {

    return (
        <Box>
            <PostWinow type={POST_TYPE.SB}/>
        </Box>
    )
}