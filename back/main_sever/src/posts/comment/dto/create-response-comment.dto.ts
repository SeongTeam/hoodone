import { PickType } from '@nestjs/mapped-types';
import { CommentModel } from '../entities/comment.entity';
import { IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateResponseCommentDto 
    extends PickType(CommentModel, ['content', 'responseToId', 'depth']) 
  {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  responseToId: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Transform(({ value }) => {
    if (value > 2 || value < 0) throw 'body.depth Depth must be between 0 and 2';

    return parseInt(value);
  })
  depth: number;
}
