'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import { customColors } from '@/utils/chakra/customColors';
import { POST_TYPE, PostContainer,QuestPost, SubmissionPost } from '@/components/posts/postType';
import { ChatIcon } from '@chakra-ui/icons';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { responseData } from '@/type/responseType';
import FavoriteButton from '../../common/FavoriteButton';

type QuestButtonsProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
};

function useStopPropagtion() {
    return useCallback((e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
}

const QuestButtons: React.FC<QuestButtonsProps> = ({ post }) => {

    /*TODO
    - UserAccount atom에서 isFavorite 정보 가져오기.
    */
    // const isUserFavorite = false;

    const stopPropagation = useStopPropagtion();




    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);
        alert('handleButtonClick');
    };



    return (
        <Flex justify={'space-between'} gap ="5px">
            <Button
                variant='purple'
                onClick={stopPropagation}
            >
                Play it!
            </Button>

            <FavoriteButton post={post} type={POST_TYPE.QUEST} />
            <Button
                leftIcon={<ChatIcon />}
                variant='purple'
                gap="5px"
            >
                {`${post.postData.comments.length}`}
            </Button>
        </Flex>
    );
};

export default QuestButtons;
