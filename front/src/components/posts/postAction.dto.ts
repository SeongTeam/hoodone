import { userAccountState } from '@/atoms/userAccount';

export interface setFavoriteDTO {
    favoriteQuests: Pick<userAccountState, 'favoriteQuests'>['favoriteQuests'];
    favoriteSbs: Pick<userAccountState, 'favoriteSbs'>['favoriteSbs'];
}
