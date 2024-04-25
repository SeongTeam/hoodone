import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    content?: string;
}
