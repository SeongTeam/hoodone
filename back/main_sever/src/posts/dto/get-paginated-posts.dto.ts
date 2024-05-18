import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaginatedPostsQueryDTO {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset: number;

    @IsInt()
    @Min(1)
    @Max(10)
    @Type(() => Number)
    limit: number;
}
