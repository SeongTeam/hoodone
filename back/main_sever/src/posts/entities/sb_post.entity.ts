import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { CommentModel } from '../-comment/entities/comment.entity';
import { PostModel } from './post.entity';
import { QuestPostModel } from './quest_post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { IsEnum, IsString } from 'class-validator';
import { SbFavoriteModel } from 'src/favorite/entities/sb_favorite.entity';

export enum VoteResult {
    NOT_YET,
    APPROVAL,
    DISAPPROVAL,
}
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

    @OneToMany(() => CommentModel, (comment) => comment.sbPost)
    comments?: CommentModel[];

    @OneToMany(() => SbFavoriteModel, (sbFavorite) => sbFavorite.favoriteUsers)
    favoriteUsers: SbFavoriteModel[];

    @Column({
        name: 'approval_user_ids',
        type: 'jsonb',
        default: [],
    })
    approvalUserIds: number[];

    @Column({
        name: 'disapproval_user_ids',
        type: 'jsonb',
        default: [],
    })
    disapprovalUserIds: number[];

    @IsEnum(VoteResult)
    @IsString()
    voteResult: VoteResult;
}
