import { PickType } from '@nestjs/mapped-types';
import { CommentModel } from '../entities/comment.entity';
import { Column } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';

export class CreateCommentDto extends PickType(CommentModel, ['content']) {}
