"use client"
import React , {useEffect}from "react";
import { Button } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { addFavorite, deleteFavorite } from "@/server-actions/postsActions";
import { POST_TYPE, PostType } from "@/type/postType";
import { responseData } from "@/type/server-action/responseType";

interface FavoriteButtonProps {
    type: POST_TYPE;
    post : PostType
}

const FavoriteButton : React.FC<FavoriteButtonProps> = ({ type, post }) => {
    const [ userAccount, setUserAccount ] = useUserAccountWithSSR();
    const [isUserFavorite, setIsUserFavorite] = React.useState(false);
    const [favoriteCount, setFavoriteCount] = React.useState(post.favoriteCount);

    const handleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if(!userAccount.isLogin)
        {   alert ('Please login first!'); 
            return;
        }
        const res = await _callFavoriteAPI(isUserFavorite);

        if (res.ok) {
            const favoriteQuests = res.response as number[];

            setUserAccount((prev) => ({
                ...prev,
                favoriteQuests: favoriteQuests,
            }));
        }

        console.log(post.id);

        setIsUserFavorite(prev => !prev);
    };
    const _callFavoriteAPI = async (isFavorite: boolean): Promise<responseData> => {
        if (!isFavorite) {
            setFavoriteCount(favoriteCount + 1);
            return await addFavorite(POST_TYPE.QUEST, post.id);
        }
        setFavoriteCount(favoriteCount - 1);

        return await deleteFavorite(POST_TYPE.QUEST, post.id);
    };

    useEffect(() => {
        if(userAccount.favoriteQuests && Array.isArray(userAccount.favoriteQuests)){
            setIsUserFavorite(userAccount.favoriteQuests.includes(post.id));
        }
    }, [userAccount]);

    return (
        <Button
                leftIcon={
                    isUserFavorite ? (
                        <Icon icon="solar:heart-bold" width="20px" height="20px" />
                    ) : (
                        <Icon icon="solar:heart-linear" width="20px" height="20px" />
                    )
                }
                variant='purple'
                gap="5px"
                onClick={handleFavorite}
            >
                {`${favoriteCount}`}
        </Button>
    );
}

export default FavoriteButton;