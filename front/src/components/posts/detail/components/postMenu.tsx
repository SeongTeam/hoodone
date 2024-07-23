'use client';
import { POST_TYPE, PostContainer, QuestPost, SubmissionPost } from '@/components/posts/postType';
import { Menu, MenuList, MenuButton, MenuItem, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReportModal } from '@/components/report/ReportModal';
import { deletePost } from '../../postsActions';
import { RouteTable } from '@/components/sidebar/SideBarRoute';

type PostMenuProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
    type: POST_TYPE;
};

/*TODO
- Post Owner만 삭제하도록 로직 수정 
*/

const PostMenu: React.FC<PostMenuProps> = ({ post, type }) => {
    const normalColor = customColors.black[100];
    const [userAccount] = useUserAccountWithSSR();
    const router = useRouter();
    const { author } = post.postData;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleReport = () => {
        onOpen();
    };

    const handleEdit = () => {
        const postId = post.postData.id;
        const index = post.paginatedOffset;
        let path = '';
        switch (type) {
            case POST_TYPE.QUEST:
                path = RouteTable.QuestRoute.getEdit(postId.toString());
                break;
            case POST_TYPE.SB:
                path = RouteTable.SubmissionRoute.getEdit(postId.toString());
                break;
        }
        router.push(`${path}?index=${index}`);
    };
    const handleDelete = async () => {
        await deletePost(type, post.postData.id, post.paginatedOffset);
        
    };

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon w="24px" h="24px" />}
                border={'none'}
                variant="outline"
                color={normalColor}
            />
            <ReportModal
                target={post.postData.type == POST_TYPE.QUEST ? 'QUEST' : 'SB'}
                id={post.postData.id}
                isOpen={isOpen}
                onClose={onClose}
            ></ReportModal>
            <MenuList>
                <MenuItem onClick={handleReport}>Report</MenuItem>
                {userAccount.nickname === author.nickname && (
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                )}
                {userAccount.nickname === author.nickname && (
                    <MenuItem onClick={handleDelete} color={customColors.error[100]}>
                        Delete
                    </MenuItem>
                )}
            </MenuList>
        </Menu>
    );
};

export default PostMenu;
