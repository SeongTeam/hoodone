import { IsArray, IsOptional, IsString } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

import { PostsModel } from '../entities/posts.entity';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, ParitalType -> 값을 반환

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
 
}
