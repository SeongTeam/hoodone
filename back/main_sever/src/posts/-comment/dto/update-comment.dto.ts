import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';
import { CreateCommentDto } from './create-comment.dto';
import { Column } from 'typeorm/decorator/columns/Column';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    content?: string;
}
