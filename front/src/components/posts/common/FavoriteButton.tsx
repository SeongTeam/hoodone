"use client"
import React , {useEffect}from "react";
import { Button } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { addFavorite, deleteFavorite } from "@/components/posts/postsActions";
import { POST_TYPE, PostContainer, QuestPost, SubmissionPost } from "@/components/posts/postType";
import { responseData } from "@/type/responseType";

interface FavoriteButtonProps {
    type: POST_TYPE;
    post : PostContainer<QuestPost | SubmissionPost>;
}

const FavoriteButton : React.FC<FavoriteButtonProps> = ({ type, post }) => {
    const [ userAccount, setUserAccount ] = useUserAccountWithSSR();
    const [isUserFavorite, setIsUserFavorite] = React.useState(false);
    const [favoriteCount, setFavoriteCount] = React.useState(post.postData.favoriteCount);
    const NO_POST_ID = 0;
    const id = post.postData.id | NO_POST_ID;
    const offset = post.paginatedOffset;
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

        console.log(id);

        setIsUserFavorite(prev => !prev);
    };
    const _callFavoriteAPI = async (isFavorite: boolean): Promise<responseData> => {
        if (!isFavorite) {
            setFavoriteCount(favoriteCount + 1);
            return await addFavorite(POST_TYPE.QUEST, id,offset);
        }
        setFavoriteCount(favoriteCount - 1);

        return await deleteFavorite(POST_TYPE.QUEST, id,offset);
    };

    useEffect(() => {
        if(userAccount.favoriteQuests && Array.isArray(userAccount.favoriteQuests)){
            setIsUserFavorite(userAccount.favoriteQuests.includes(id));
        }
    }, [userAccount,id]);

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