import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from 'src/_common/entity/base.entity';
import { PostType } from 'src/posts/-comment/enum/post_type';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Exclude({ toPlainOnly: true })
export class QuestFavoriteModel extends BaseModel {
    @ManyToOne(() => UserModel, (user) => user.favoriteQuests)
    favoriteUsers: UserModel;

    @ManyToOne(() => QuestPostModel, (quest) => quest.favoriteUsers)
    favoriteQuests: QuestPostModel;

    @Expose()
    @Column({ name: 'post_id' })
    @IsNumber()
    postId: number;

    @Column({ name: 'postType', type: 'enum', enum: PostType, array: false })
    postType: PostType;

    @Expose()
    @Column({
        default: false,
    })
    isConfirmed: boolean;
}
