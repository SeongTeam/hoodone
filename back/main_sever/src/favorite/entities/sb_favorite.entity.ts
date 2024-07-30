import { SbPostModel } from '@/posts/entities/sb_post.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseModel } from 'src/_common/entity/base.entity';
import { PostType } from 'src/posts/-comment/enum/post_type';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Exclude({ toPlainOnly: true })
export class SbFavoriteModel extends BaseModel {
    @ManyToOne(() => UserModel, (user) => user.favoriteSbs)
    favoriteUsers: UserModel;

    @ManyToOne(() => SbPostModel, (sb) => sb.favoriteUsers)
    favoriteSbs: SbPostModel;

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
