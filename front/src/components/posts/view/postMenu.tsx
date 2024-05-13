"use client"
import { PostType, postState  } from "@/atoms/post";
import { Menu, MenuList, MenuButton, MenuItem, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React from "react";
import { customColors } from "@/utils/chakra/customColors";

type PostMenuProps = {
    post : PostType
}


const PostMenu: React.FC<PostMenuProps> = ({post}) => {
    const bg = customColors.black[300];
    const isOwner = false;

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon/>}
                bg={bg}
                border={"none"}
            />
            <MenuList>
                <MenuItem>Report</MenuItem>
                <MenuItem color={customColors.error[100]}>Delete</MenuItem>
                
            </MenuList>
        </Menu>
    )  
}

export default PostMenu;