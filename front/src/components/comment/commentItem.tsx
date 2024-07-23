'use client';
import { CommentType, CommentClass } from '@/type/commentType';
import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import Comment from './comment';
import InputReply from './InputReply';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import DeletedCommentItem from './deletedCommentItem';
import { POST_TYPE } from '@/components/posts/postType';
import { RouteTable } from '../sidebar/SideBarRoute';

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
        let route = '';
        switch (postType) {
            case POST_TYPE.QUEST:
                route = RouteTable.QuestRoute.getDetailComment(postId, commentid.toString());
                break;
            case POST_TYPE.SB:
                route = RouteTable.SubmissionRoute.getDetailComment(postId, commentid.toString());
                break;
        }
        const path = `${route}?index=${index}`;
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
                    postType={postType}
                    postId={Number(params.postid)}
                />
            )}
            {isWriteReply && (
                <InputReply
                    handleAddReply={handleAddReply}
                    handleCancelReply={handleCancelReply}
                    parentComment={comment}
                    postType={postType}
                />
            )}
            {isShowReply && childrenReplyList}
        </Flex>
    );
};

export default CommentItem;
