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
    // nullable: false,
  })
  author: UserModel;

  @ManyToOne(() => PostsModel, (post) => post.comments, {
    // nullable: false,
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

  // // @RelationId 데코레이터는 한 방향으로만 정의가 됩니다.
  // // 관계에 있어서 댓글의 대댓글이 정해지면 자동으로 responseComment id가 들어가집니다
  // @RelationId((responseComment: ResponseCommentModel) =>responseComment )
  // ResponseCommentIDs: number[];

  @Column({
    type: 'jsonb',
    default: [],
  })
  responseCommentIDs: number[];

  // depth를 통해서 어떠한 몇 차 댓글인지 확인
  @Column({ type: `smallint` })
  @IsNotEmpty()
  @IsNumber()
  depth: number;

  // 저장할 떄 게시물의 몇번재 댓글인 확인하기
  @Column({ type: `smallint` })
  @IsNumber()
  index: number;
}
