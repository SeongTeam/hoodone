'use client';
import { CommentType, CommentClass } from '@/atoms/comment';
import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import Comment from './comment';
import InputReply from './InputReply';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import DeletedCommentItem from './deletedCommentItem';
import { POST_TYPE } from '@/type/postType';

type CommentItemProps = {
    comment: CommentType;
    childrenReplyList: React.ReactNode;
    isWritingOnCurrentPage: boolean;
    postType : POST_TYPE;
};
const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    childrenReplyList,
    isWritingOnCurrentPage,
    postType,
}) => {
    const [isShowReply, setIsShowReply] = useState(false);
    const [isWriteReply, setIsWriteReply] = useState(false);
    const commentInstance = new CommentClass(comment);
    const router = useRouter();
    const params = useParams<{ postid: string }>();
    const searchParams = useSearchParams();

    const navigateToCommentPage = () => {
        const commentid = comment.id;
        const index = searchParams.get('index');
        const postId = params.postid;
        const rootPath = postType === POST_TYPE.QUEST ? 'quest' : 'sb';
        const path = `/${rootPath}/${postId}/comment/${commentid}?index=${index}`;
        router.push(path);
    };

    const handleShowReply = () => {
        if (commentInstance.isAccessableReply()) {
            setIsShowReply(!isShowReply);
        } else if (commentInstance.isHaveReply()) {
            navigateToCommentPage();
        }
    };

    const handleWriteReply = () => {
        if (isWritingOnCurrentPage) {
            setIsWriteReply(!isWriteReply);
        } else {
            navigateToCommentPage();
        }
    };

    const handleCancelReply = () => {
        setIsWriteReply(false);
    };

    const handleAddReply = () => {
        setIsWriteReply(false);
        setIsShowReply(true);
    };

    return (
        <Flex
            w="full"
            flexDir={'column'}
            borderRadius={'15px'}
            // borderLeft={`3px solid ${borderColor}`}
            gap={'10px'}
            mb="5px"
        >
            {commentInstance.isDeleted() ? (
                <DeletedCommentItem
                    commentInstance={commentInstance}
                    isShowReply={isShowReply}
                    handleShowReplyIconClicked={handleShowReply}
                />
            ) : (
                <Comment
                    commentInstance={commentInstance}
                    handleReplyButtonClicked={handleWriteReply}
                    handleShowReplyIconClicked={handleShowReply}
                    isShowReply={isShowReply}
                />
            )}
            {isWriteReply && (
                <InputReply
                    handleAddReply={handleAddReply}
                    handleCancelReply={handleCancelReply}
                    parentComment={comment}
                />
            )}
            {isShowReply && childrenReplyList}
        </Flex>
    );
};

export default CommentItem;
