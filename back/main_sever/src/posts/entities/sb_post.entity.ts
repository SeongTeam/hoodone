import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentModel } from '../-comment/entities/comment.entity';
import { PostModel } from './post.entity';
import { QuestPostModel } from './quest_post.entity';

@Entity('sb_post')
export class SbPostModel extends PostModel {
    @ManyToOne(() => QuestPostModel, (post) => post.sbPosts, {})
    @JoinColumn({ name: 'parent_post_id' })
    parentPost: QuestPostModel;

    @OneToMany(() => CommentModel, (comment) => comment.sbtPost)
    comments?: CommentModel[];
}
