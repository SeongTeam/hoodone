'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import { customColors } from '@/utils/chakra/customColors';
import { POST_TYPE, PostType } from '@/type/postType';
import { ChatIcon } from '@chakra-ui/icons';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { responseData } from '@/type/server-action/responseType';
import { addFavorite, deleteFavorite } from '@/server-actions/postsActions';

type QuestButtonsProps = {
    post: PostType;
};

function useStopPropagtion() {
    return useCallback((e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
}

const QuestButtons: React.FC<QuestButtonsProps> = ({ post }) => {
    const buttonColor = customColors.white[100];
    const buttonBg = customColors.purple[100];

    /*TODO
    - UserAccount atom에서 isFavorite 정보 가져오기.
    */
    // const isUserFavorite = false;

    const [favoriteCount, setFavoriteCount] = useState<number>(post.favoriteCount);
    const [userState, setUserState] = useUserAccountWithSSR();
    const [isFavorite, setIsUserFavorite] = useState<boolean>(false);

    const handleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);

        const res = await _callFavoriteAPI(isFavorite);

        if (res.ok) {
            const favoriteQuests = res.response as number[];

            setUserState((prev) => ({
                ...prev,
                favoriteQuests: favoriteQuests,
            }));
        }

        console.log(post.id);

        setIsUserFavorite(!isFavorite);
    };
    const _callFavoriteAPI = async (isFavorite: boolean): Promise<responseData> => {
        if (!isFavorite) {
            setFavoriteCount(favoriteCount + 1);
            return await addFavorite(POST_TYPE.QUEST, post.id);
        }
        setFavoriteCount(favoriteCount - 1);

        return await deleteFavorite(POST_TYPE.QUEST, post.id);
    };

    const stopPropagation = useStopPropagtion();

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event);
        alert('handleButtonClick');
    };

    useEffect(() => {
        setIsUserFavorite(userState.favoriteQuests.includes(post.id));
    }, [userState]);

    return (
        <Flex justify={'space-between'}>
            <Button
                color={buttonColor}
                bg={buttonBg}
                onClick={stopPropagation}
                _hover={{ bg: customColors.purple[200] }}
            >
                Play it!
            </Button>

            <Button
                leftIcon={
                    isFavorite ? (
                        <Icon icon="solar:heart-bold" width="20px" height="20px" />
                    ) : (
                        <Icon icon="solar:heart-linear" width="20px" height="20px" />
                    )
                }
                color={buttonColor}
                gap="10px"
                bg={buttonBg}
                onClick={handleFavorite}
                _hover={{ bg: customColors.purple[200] }}
            >
                {`${post.favoriteCount}`}
            </Button>
            <Button
                leftIcon={<ChatIcon />}
                color={buttonColor}
                gap="10px"
                bg={buttonBg}
                _hover={{ bg: customColors.purple[200] }}
            >
                {`${post.comments.length}`}
            </Button>
        </Flex>
    );
};

export default QuestButtons;
