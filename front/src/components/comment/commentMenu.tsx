import React from "react"
import { CommentClass } from "@/atoms/comment";
import { Flex, IconButton, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { SlOptions } from "react-icons/sl";
import { deleteComment } from "@/server-actions/commentAction";
import { usePathname , useParams } from "next/navigation";
import { useIsOwner } from "@/hooks/userAccount";
import { customColors } from "@/utils/chakra/customColors";

type CommentMenuType = {
    commentInstance: CommentClass
}

/*TODO
- Edit 기능 구현
- delete, edit 기능 Authorization 구현
- Report 기능 구현
- 디자인 보완
    - nested comment 구조의 모든 comment가 menuButton 위치 동일하게 하기
    - menu 디자인 설정
    - 삭제된 comment 디자인 설정
*/
const CommentMenu : React.FC<CommentMenuType> = ({commentInstance}) => {
    const path = usePathname();
    const params = useParams<{ postid: string}>();
    const isOwner = useIsOwner(commentInstance.getComment().author.nickname);

    const handleReport = () => {
        alert('Report');
    }

    const handleEdit = () => {
        alert('Edit');
    }
    const handleDelete = () => {
        const postId = parseInt(params.postid);
        const commentId = commentInstance.getComment().id;
        deleteComment(postId, commentId , path);
    }
    return(
        <Menu isLazy>
            <MenuButton 
                as={IconButton} 
                icon={<SlOptions/>}
                variant={"link"}
                colorScheme="black"
                aria-label="comment menu" 
                color={customColors.black[300]}
            />
            <MenuList

            >
                <MenuItem
                    textColor={customColors.black[300]} 
                    onClick={handleReport}
                    _hover = {{bg: customColors.white[200]}}    
                >
                    Report
                </MenuItem>
                <MenuItem 
                    textColor={customColors.black[300]}
                    hidden={!isOwner}
                    onClick={handleEdit}
                    _hover = {{bg: customColors.white[200]}}
                >
                    Edit
                </MenuItem>
                <MenuItem 
                    textColor={customColors.red[100]}
                    hidden={!isOwner}
                    onClick={handleDelete}
                    _hover = {{bg: customColors.white[200]}}
                >
                    Delete
                </MenuItem>

            </MenuList>

        </Menu>
    );
}

export default CommentMenu;