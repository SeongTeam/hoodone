import { BaseModel } from 'src/_common/entity/base.entity';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
export class SbFavoriteModel extends BaseModel {
    @ManyToOne(() => UserModel, (user) => user.favoriteQuests)
    favoriteUsers: UserModel;

    @ManyToOne(() => QuestPostModel, (quest) => quest.favoriteUsers)
    favoriteSbs: QuestPostModel;

    @Column({
        default: false,
    })
    isConfirmed: boolean;
}
