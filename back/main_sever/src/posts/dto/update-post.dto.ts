import { PartialType, PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entities/post.entity';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    title?: string;

    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    content?: string;

    @IsString({
        message: stringValidationMessage,
    })
    @IsOptional()
    cloudinaryPublicId?: string;

    @IsOptional()
    tags?: string[];
}
