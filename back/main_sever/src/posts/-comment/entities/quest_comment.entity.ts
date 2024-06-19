import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Column, Entity, JoinColumn } from 'typeorm';

import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { SbPostModel } from 'src/posts/entities/sb_post.entity';
import { CommentModel } from './comment.entity';

@Entity('quest_comment')
export class QuestCommentModel extends CommentModel {
    @ManyToOne(() => QuestPostModel, (post) => post.comments, { nullable: true })
    @JoinColumn({ name: 'quest_post_id' })
    questPost: QuestPostModel;
}
