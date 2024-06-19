import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Column, Entity, JoinColumn } from 'typeorm';

import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { SbPostModel } from 'src/posts/entities/sb_post.entity';

@Entity('comment')
export class CommentModel extends BaseModel {
    @ManyToOne(() => UserModel, (user) => user.comments, {})
    @JoinColumn({ name: 'user_id' })
    author: UserModel;

    @ManyToOne(() => QuestPostModel, (post) => post.comments, { nullable: true })
    @JoinColumn({ name: 'quest_post_id' })
    questPost: QuestPostModel;

    @ManyToOne(() => SbPostModel, (post) => post.comments, { nullable: true })
    @JoinColumn({ name: 'sb_post_id' })
    sbtPost: SbPostModel;

    @Column()
    @IsNotEmpty()
    @IsString({
        message: stringValidationMessage, //todo 게시물과 동일한 message rule을 적요?
    })
    content: string;

    @Column({ name: 'like_count', default: 0, type: `smallint` })
    @IsNumber()
    likeCount: number;

    @Column({
        name: 'reply_comment_ids',
        type: 'jsonb',
        default: [],
    })
    replyCommentIds: number[];

    // depth를 통해서 몇 차 댓글인지 확인
    @Column({ type: `smallint` })
    @IsNotEmpty()
    @IsNumber()
    depth: number;

    // 저장할떄 몇번재 댓글인지 확인하기
    @Column({ type: `smallint` })
    @IsNumber()
    index: number;

    @Column({ name: 'response_to_id', default: 0 })
    responseToId: number;

    @Column({ name: 'is_deleted', default: false })
    isUserDelete: boolean;
}
