import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { CommentModel } from '../comment/entities/comment.entity';

@Entity('post')
export class PostModel extends BaseModel {
    // 1) UsersModel과 연동한다 Foreign Key를 이용해서
    // 2) null이 될 수 없다.
    //
    @ManyToOne(() => UserModel, (user) => user.posts, {
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
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

    @Column({ name: 'like_count' })
    likeCount: number;

    @Column({ name: 'comment_count' })
    commentCount: number;

    @Column({ name: 'is_published' })
    isPublished: boolean;

    @OneToMany(() => CommentModel, (comment) => comment.post)
    comments: CommentModel[];
}
