import { PostApiResponseDto } from './post-api-reponse.dto';

export class QuestPostApiResponseDto extends PostApiResponseDto {
    getPaginatedSbs?: object[];
    patchQuestIncreaseFavorite?: number[] | string;
    patchQuestDecreaseFavorite?: number[] | string;
}
