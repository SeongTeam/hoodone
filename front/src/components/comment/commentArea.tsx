"use client"
import InputComment from "./InputComment";
import CommentItemList from "./commenItemtList";
import { CommentType } from "@/atoms/commen";
import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";


type CommentAreaProps = {
    comments: CommentType[]
}


const CommentArea: React.FC<CommentAreaProps> = ({comments}) => {

    const [commentList, setCommentList] = useState<CommentType[]>(comments);
    const addComment = (newComment: CommentType) => {
        setCommentList(prev => [...prev, newComment]);
    }

    return (
        <Flex w="full" h="full" flexDirection={"column"} gap="1rem">
            <InputComment handleAddComment={addComment} />
            <CommentItemList comments={commentList}/>
        </Flex>
    )
}

export default CommentArea;
