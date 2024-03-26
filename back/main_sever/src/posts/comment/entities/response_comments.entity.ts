import { Column, Entity } from 'typeorm';
import { CommentModel } from './comments.entity';

@Entity()
export class ResponseCommentModel extends CommentModel {
  // ResponseModel와 다른 부분
  @Column()
  responseToId: number;
}
