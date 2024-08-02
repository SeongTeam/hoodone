"use client"
import React , {useEffect}from "react";
import { Button } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { setFavoriteQuest, setFavoriteSb } from "@/components/posts/postsActions";
import { POST_TYPE, PostContainer, QuestPost, SubmissionPost } from "@/components/posts/postType";
import { responseData } from "@/type/responseType";
import { setFavoriteDTO } from '@/components/posts/postAction.dto';

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
            
            console.log("response", res.response);
            if(type === POST_TYPE.QUEST){
                const { favoriteQuests } = res.response as setFavoriteDTO;
                setUserAccount((prev) => ({
                    ...prev,
                    favoriteQuests
                }));
            }
            else{

                const { favoriteSbs } = res.response as setFavoriteDTO;
                setUserAccount((prev) => ({
                    ...prev,
                    favoriteSbs,
                }));
            }

        }


        console.log(id);

        setIsUserFavorite(prev => !prev);
    };
    const _callFavoriteAPI = async (isFavorite: boolean) => {
        
        let ret : responseData ;

        setFavoriteCount(favoriteCount + (isFavorite ? -1 : 1));

        switch (type) {
            case POST_TYPE.QUEST:
                ret =  await setFavoriteQuest(id, offset, !isFavorite);
                break;
            case POST_TYPE.SB:
                ret = await setFavoriteSb(id, offset, !isFavorite);
                break;
            default:
                ret = { ok: false, message: 'Favorite Operation. try it later', response: {} };
        }
        
        return ret;
    };

    useEffect(() => {
        if(type === POST_TYPE.QUEST){
            if(userAccount.favoriteQuests && Array.isArray(userAccount.favoriteQuests)){
                setIsUserFavorite(userAccount.favoriteQuests.includes(id));
            }
            console.log("FavoriteButton", type, userAccount.favoriteQuests);
        }else{
            if(userAccount.favoriteSbs && Array.isArray(userAccount.favoriteSbs)){
                setIsUserFavorite(userAccount.favoriteSbs.includes(id));
            }
            console.log("FavoriteButton", type, userAccount.favoriteSbs);
        }

        
    }, [userAccount,id,type]);

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