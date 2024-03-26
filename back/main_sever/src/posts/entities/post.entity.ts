import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { CommentModel } from '../comment/entities/comment.entity';

@Entity()
export class PostModel extends BaseModel {
  // 1) UsersModel과 연동한다 Foreign Key를 이용해서
  // 2) null이 될 수 없다.
  //
  @ManyToOne(() => UserModel, (user) => user.posts, {
      nullable: false,
  })
  author: UserModel;  

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @Column()
  isPublished: boolean
  
  @OneToMany(() => CommentModel, (comment) => comment.post)
  comments: CommentModel[];
  
}
