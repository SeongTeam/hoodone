import { PickType } from '@nestjs/mapped-types';
import { CommentModel } from '../entities/comment.entity';
import { IsBoolean, IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm/decorator/columns/Column';

export class CreateReplyCommentDto extends PickType(CommentModel, ['content', 'responseToId']) {
    @Column()
    @IsBoolean()
    isQuestPost: boolean;

    // @IsNotEmpty()
    // content: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        return parseInt(value);
    })
    responseToId: number;
}
