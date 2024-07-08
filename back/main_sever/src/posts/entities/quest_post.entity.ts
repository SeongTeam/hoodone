import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { CommentModel } from '../-comment/entities/comment.entity';
import { PostModel } from './post.entity';
import { SbPostModel } from './sb_post.entity';
import { QuestFavoriteModel } from 'src/favorite/entities/quest_favorite.entity';

@Entity('quest_post')
export class QuestPostModel extends PostModel {
    @ManyToOne(() => UserModel, (user) => user.questPosts, {
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
    author: UserModel;

    @OneToMany(() => SbPostModel, (sbPost) => sbPost.parentPost)
    sbPosts: SbPostModel[];

    @OneToMany(() => CommentModel, (comment) => comment.questPost)
    comments?: CommentModel[];

    @OneToMany(() => QuestFavoriteModel, (questFavorite) => questFavorite.favoriteUsers)
    favoriteUsers: QuestFavoriteModel[];
}
