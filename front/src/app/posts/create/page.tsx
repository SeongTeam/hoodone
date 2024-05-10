'use client'

import { Box, Stack } from "@chakra-ui/react";
import CreatePostForm from "@/components/posts/create/createPostForm";
import { useRecoilState } from "recoil";
import { UserAccountState } from "@/atoms/userAccount";


export default function CreatePostPage() {
    const [userAccount, setUserAccount] = useRecoilState(UserAccountState);

    return (
        <Box 
        >
            <CreatePostForm userAccount={userAccount}/>
        </Box>
    );
}