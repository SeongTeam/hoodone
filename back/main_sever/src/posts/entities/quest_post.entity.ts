import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { CommentModel } from '../-comment/entities/comment.entity';
import { PostModel } from './post.entity';
import { SbPostModel } from './sb_post.entity';

@Entity('quest_post')
export class QuestPostModel extends PostModel {
    @OneToMany(() => SbPostModel, (sbPost) => sbPost.parentPost)
    sbPosts: SbPostModel[];

    @OneToMany(() => CommentModel, (comment) => comment.questPost)
    comments?: CommentModel[];
}
