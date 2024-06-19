import { PickType } from '@nestjs/mapped-types';
import { CommentModel } from '../entities/comment.entity';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReplyCommentDto extends PickType(CommentModel, ['content', 'responseToId']) {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        return parseInt(value);
    })
    responseToId: number;
}
