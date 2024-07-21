import React from 'react';
import { CommentClass } from '@/type/commentType';
import {
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
} from '@chakra-ui/react';
import { SlOptions } from 'react-icons/sl';
import { deleteComment } from '@/server-actions/commentAction';
import { usePathname, useParams } from 'next/navigation';
import { useIsOwner } from '@/hooks/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import { POST_TYPE } from '@/components/posts/postType';
import { ReportModal } from '../report/ReportModal';

type CommentMenuType = {
    commentInstance: CommentClass;
    postType: POST_TYPE;
    postId: number;
};

/*TODO
- Edit 기능 구현
- delete, edit 기능 Authorization 구현
- Report 기능 구현
- 디자인 보완
    - nested comment 구조의 모든 comment가 menuButton 위치 동일하게 하기
    - menu 디자인 설정
    - 삭제된 comment 디자인 설정
*/
const CommentMenu: React.FC<CommentMenuType> = ({ commentInstance, postType, postId }) => {
    const path = usePathname();
    const isOwner = useIsOwner(commentInstance.getComment().author.nickname);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleReport = () => {
        onOpen();
    };

    const handleEdit = () => {
        alert('Edit');
    };
    const handleDelete = () => {
        const commentId = commentInstance.getComment().id;
        deleteComment(postType, postId, commentId, path);
    };
    return (
        <Menu isLazy>
            <MenuButton
                as={IconButton}
                icon={<SlOptions />}
                variant={'link'}
                colorScheme="black"
                aria-label="comment menu"
                color={customColors.black[300]}
            />
            <ReportModal
                target="COMMENT"
                id={commentInstance.comment.id}
                isOpen={isOpen}
                onClose={onClose}
            ></ReportModal>
            <MenuList>
                <MenuItem
                    textColor={customColors.black[300]}
                    onClick={handleReport}
                    _hover={{ bg: customColors.white[200] }}
                >
                    Report
                </MenuItem>
                <MenuItem
                    textColor={customColors.black[300]}
                    hidden={!isOwner}
                    onClick={handleEdit}
                    _hover={{ bg: customColors.white[200] }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    textColor={customColors.red[100]}
                    hidden={!isOwner}
                    onClick={handleDelete}
                    _hover={{ bg: customColors.white[200] }}
                >
                    Delete
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default CommentMenu;
