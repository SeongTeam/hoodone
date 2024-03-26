import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Column, Entity } from 'typeorm';

import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';

@Entity()
export class CommentModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.comments, {
  })
  author: UserModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, {
  })
  post: PostsModel;

  @Column()
  @IsNotEmpty()
  @IsString({
    message: stringValidationMessage, //todo 게시물과 동일한 message rule을 적요?
  })
  content: string;

  @Column({ default: 0, type: `smallint` })
  @IsNumber()
  likeCount: number;

  @Column({
    type: 'jsonb',
    default: [],
  })
  responseCommentIDs: number[];

  // depth를 통해서 몇 차 댓글인지 확인
  @Column({ type: `smallint` })
  @IsNotEmpty()
  @IsNumber()
  depth: number;

  // 저장할떄 몇번재 댓글인지 확인하기
  @Column({ type: `smallint` })
  @IsNumber()
  index: number;

  @Column({ default: 0})
  responseToId: number;
}
