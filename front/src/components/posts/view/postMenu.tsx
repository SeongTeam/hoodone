"use client"
import { POST_TYPE, PostType } from '@/type/postType';
import { Menu, MenuList, MenuButton, MenuItem, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React from "react";
import { customColors } from "@/utils/chakra/customColors";
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { useRouter, useSearchParams } from 'next/navigation';

type PostMenuProps = {
    post : PostType
    type : POST_TYPE
}

/*TODO
- Post Owner만 삭제하도록 로직 수정 
*/

const PostMenu: React.FC<PostMenuProps> = ({post, type}) => {
    const normalColor = customColors.black[100];
    const [userAccount ] = useUserAccountWithSSR();
    const router = useRouter();
    const index = useSearchParams().get('index');


    const handleReport= () => {
        alert('Report function is not implemented yet');
    }

    const handleEdit = () => {
        const path = type === POST_TYPE.QUEST ? `quest` : `sb`;
        const postId = post.id;
        router.push(`/${path}/${postId}/edit?index=${index}`);
    }
    const handleDelete = () => {
        alert('Delete function is not implemented yet');
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon w="24px" h="24px"/>}
                border={"none"}
                variant="outline"
                color = {normalColor}

            />
            <MenuList>
                <MenuItem 
                    onClick={handleReport}
                >
                    Report
                </MenuItem>
                { userAccount.nickname === post.author.nickname 
                && <MenuItem
                    onClick={handleEdit}
                    >
                    Edit
                    </MenuItem> 
                }
                { userAccount.nickname === post.author.nickname 
                && <MenuItem 
                    onClick={handleDelete} 
                    color={customColors.error[100]}
                    >
                        Delete
                    </MenuItem> 
                }
            </MenuList>
        </Menu>
    )  
}

export default PostMenu;