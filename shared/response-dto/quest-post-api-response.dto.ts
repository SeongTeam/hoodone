import { PostApiResponseDto } from './post-api-reponse.dto';

export class QuestPostApiResponseDto extends PostApiResponseDto {
    getPaginatedSbs?: object[];
    patchIncreaseFavorite?: number[] | string;
    patchDecreaseFavorite?: number[] | string;
}
