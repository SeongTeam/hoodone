"use client"
import { PostType } from '@/type/postType';
import { Menu, MenuList, MenuButton, MenuItem, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React from "react";
import { customColors } from "@/utils/chakra/customColors";
import { useUserAccountWithSSR } from "@/hooks/userAccount";

type PostMenuProps = {
    post : PostType
}

/*TODO
- Post Owner만 삭제하도록 로직 수정 
*/

const PostMenu: React.FC<PostMenuProps> = ({post}) => {
    const normalColor = customColors.black[100];
    const [ userAccount ] = useUserAccountWithSSR();

    const handleReport= () => {
        alert('Report function is not implemented yet');
    }

    const handleEdit = () => {
        alert('Edit function is not implemented yet');
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