// import { Board } from "src/boards/board.entity";
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { passwordValidationMessage } from 'src/common/validation-message/password-vaildation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { CommentModel } from 'src/posts/comment/entities/comment.entity';

export enum UserModelStatus {
  ACTIVE,
  SUSPENDED,
  BANNED,
}
@Entity()
@Exclude({ toPlainOnly: true })
export class UserModel extends BaseModel {
  @Expose()
  @Column({ length: 20, unique: true })
  @IsString({ message: stringValidationMessage })
  @Length(1, 16, { message: lengthValidationMessage })
  nickName: string;

  @Expose()
  @Column({ unique: true })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string; // 1) 유일무이한 값이 될 것

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(4, 20, { message: lengthValidationMessage })
  //영어랑 숫자만 가능한 유효성 체크
  // todo 회원가입할때 비밀번호 규칙을 적용해야 한다. DB에 적용할 필요 x
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: passwordValidationMessage,
  })
  password: string;

  @Column({
    enum: UserModelStatus,
  })
  @IsEnum(UserModelStatus)
  @IsString()
  status: UserModelStatus;

  @Column({ nullable: true })
  suspensionEnd: string; // 정지기간은 잘 사용하지 않을 거라고 판다

  @Column()
  userReportCount: number;

  @Column()
  userReportedCount: number;

  // // 좋아요를 누른 게시판
  // @Expose()
  // @OneToMany(() => PostModel, (post) => post.author)
  // likedPosts: PostModel[];

  @Expose()
  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @Expose()
  @OneToMany(() => CommentModel, (comment) => comment.author)
  comments: CommentModel[];
}
