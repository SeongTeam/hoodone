import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseModel } from 'src/_common/entity/base.entity';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { SbPostModel } from 'src/posts/entities/sb_post.entity';

@Entity('ticket')
export class TicketModel extends BaseModel {
    @OneToOne(() => UserModel, (user) => user.ticket)
    @JoinColumn({ name: 'user_id' })
    user: UserModel;

    @Column({ name: 'count' })
    count: number;

    @Column({ name: 'usage_history' })
    usageHistory: string;
}
