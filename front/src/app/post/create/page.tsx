'use client'

import { Box, Stack } from "@chakra-ui/react";
import CreatePostForm from "@/components/posts/create/createPostForm";
import { useRecoilState } from "recoil";
import { useUserAccountWithSSR } from "@/atoms/userAccount";


export default function CreatePostPage() {
    const [user, setUser] = useUserAccountWithSSR();

    return (
        <Box 
        >
            <CreatePostForm userAccount={user}/>
        </Box>
    );
}