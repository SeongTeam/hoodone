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
import { RouteTable } from '@/components/sidebar/SideBarRoute';
import { useRouter } from 'next/navigation';

type QuestButtonsProps = {
    post: PostContainer<QuestPost | SubmissionPost>;
};

function useStopPropagtion() {
    return useCallback((e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
}

const QuestButtons: React.FC<QuestButtonsProps> = ({ post }) => {

    const stopPropagation = useStopPropagtion();
    const router = useRouter();



    const hanldePlayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);
        const path = RouteTable.SubmissionRoute.getCreate(post.postData.id.toString());

        router.push(path);
    };



    return (
        <Flex justify={'space-between'} gap ="5px">

            { post.postData.type === POST_TYPE.QUEST ?
                <Button
                    variant='purple'
                    onClick={hanldePlayClick}
                >
                    Play it!
                </Button>
                :
                <Button
                    variant='purple'
                >
                    Vote it
                </Button>
            }
            <FavoriteButton post={post} type={post.postData.type} />
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
