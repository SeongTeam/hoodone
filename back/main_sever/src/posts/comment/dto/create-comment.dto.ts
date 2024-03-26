import { PickType } from "@nestjs/mapped-types";
import { CommentModel } from "../entities/comments.entity";

export class CreateCommentDto  extends PickType(CommentModel, [ 'content']){}
