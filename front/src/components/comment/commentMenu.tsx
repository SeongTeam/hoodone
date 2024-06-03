import React from "react"
import { CommentClass } from "@/atoms/comment";
import { Flex, IconButton, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { SlOptions } from "react-icons/sl";
import { deleteComment } from "@/server-actions/commentAction";
import { usePathname , useParams } from "next/navigation";

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
                border={"none"}
                colorScheme="black"
                aria-label="comment menu" 
            />
            <MenuList>
                
                <MenuItem onClick={handleReport}>
                    Report
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    Delete
                </MenuItem>

            </MenuList>

        </Menu>
    );
}

export default CommentMenu;