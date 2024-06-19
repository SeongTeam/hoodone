import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentModel } from '../-comment/entities/comment.entity';
import { PostModel } from './post.entity';
import { QuestPostModel } from './quest_post.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Entity('sb_post')
export class SbPostModel extends PostModel {
    @ManyToOne(() => UserModel, (user) => user.sbPosts, {
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
    author: UserModel;

    @ManyToOne(() => QuestPostModel, (post) => post.sbPosts, {})
    @JoinColumn({ name: 'parent_post_id' })
    parentPost: QuestPostModel;

    @OneToMany(() => CommentModel, (comment) => comment.sbtPost)
    comments?: CommentModel[];
}
