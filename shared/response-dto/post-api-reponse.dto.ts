/**파라미터 경우 by를 사용, 복수일 경우 명사s 사용*/
export class PostApiResponseDto {
    getAll?: object[];

    getPostsByEmail?: object[];

    getById?: object;

    post?: object;

    getPaginatedPosts?: object;

    patchFavorite?: number[];
    patchVote?: voteResponseDto;
    delete?: boolean;
}

export interface voteResponseDto {
    ok: boolean;
    message: string;
    result: object;
}
