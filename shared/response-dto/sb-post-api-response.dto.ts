import { PostApiResponseDto } from './post-api-reponse.dto';

export class SbPostApiResponseDto extends PostApiResponseDto {
    patchSbIncreaseFavorite?: number[] | string;
    patchSbDecreaseFavorite?: number[] | string;
}
