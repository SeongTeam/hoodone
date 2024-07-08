// import { Board } from "src/boards/board.entity";
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { emailValidationMessage } from 'src/_common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/_common/validation-message/length-validation.message';
import { passwordValidationMessage } from 'src/_common/validation-message/password-vaildation.message';
import { stringValidationMessage } from 'src/_common/validation-message/string-validation.message';
import { BaseModel } from 'src/_common/entity/base.entity';
import { RoleType } from '../const/role.type';
import { BoardModel } from 'src/boards/entities/board.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { CommentModel } from 'src/posts/-comment/entities/comment.entity';
import { QuestPostModel } from 'src/posts/entities/quest_post.entity';
import { SbPostModel } from 'src/posts/entities/sb_post.entity';
import { TicketModel } from 'src/users/_tickets/entities/ticket.entity';
import { QuestFavoriteModel } from 'src/favorite/entities/quest_favorite.entity';
import { SbFavoriteModel } from 'src/favorite/entities/sb_favorite.entity';

export enum UserModelStatus {
    ACTIVE,
    SUSPENDED,
    BANNED,
}
@Entity('user')
@Exclude({ toPlainOnly: true })
export class UserModel extends BaseModel {
    @Expose()
    @Column({ length: 20, unique: true })
    @IsString({ message: stringValidationMessage })
    @Length(1, 16, { message: lengthValidationMessage })
    nickname: string;

    @Expose()
    @Column({ unique: true })
    @IsString({ message: stringValidationMessage })
    @IsEmail({}, { message: emailValidationMessage })
    email: string; // 1) 유일무이한 값이 될 것

    @Column()
    @IsString({ message: stringValidationMessage })
    @Length(4, 20, { message: lengthValidationMessage })
    //영어랑 숫자만 가능한 유효성 체크
    // todo 회원가입할때 비밀번호 규칙을 적용해야 한다. DB에 적용할 필요 x
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: passwordValidationMessage,
    })
    password: string;

    @Column({ type: 'enum', enum: RoleType, array: true })
    roles: RoleType[];

    @IsEnum(UserModelStatus)
    @IsString()
    status: UserModelStatus;

    @Column({ nullable: true, name: 'suspension_end' })
    suspensionEnd: string; // 정지기간은 잘 사용하지 않을 거라고 판다

    @Column({ name: 'user_report_count' })
    userReportCount: number;

    @Column({ name: 'user_reported_count' })
    userReportedCount: number;

    @Column({ name: 'verification_token', default: '' })
    @IsString()
    verificationToken: string; // 비밀번호 초기화 와 같은 임시로 토큰이 필요할 겨우 사용

    // // 좋아요를 누른 게시판
    // @Expose()
    // @OneToMany(() => PostModel, (post) => post.author)
    // likedPosts: PostModel[];

    @Expose()
    @Column({ name: 'profile_image_public_id', default: '' })
    @IsString()
    profileImagePublicId: string;

    @Expose()
    @OneToMany(() => QuestPostModel, (post) => post.author)
    questPosts: QuestPostModel[];

    @OneToMany(() => SbPostModel, (post) => post.author)
    sbPosts: PostModel[];

    @Expose()
    @OneToMany(() => CommentModel, (comment) => comment.author)
    comments: CommentModel[];

    @OneToMany(() => BoardModel, (board) => board.author)
    boards: BoardModel[];

    @OneToOne(() => TicketModel, (ticket) => ticket.user)
    @JoinColumn()
    ticket: TicketModel;

    @OneToMany(() => QuestFavoriteModel, (questFavorite) => questFavorite.favoriteUsers)
    favoriteQuests: QuestFavoriteModel[];

    @OneToMany(() => SbFavoriteModel, (sbFavorite) => sbFavorite.favoriteUsers)
    favoriteSbs: SbFavoriteModel[];
}
