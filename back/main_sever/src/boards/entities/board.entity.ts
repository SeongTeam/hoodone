import { IsIn, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum AccessLevel {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('board')
export class BoardModel extends BaseModel {
    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    name: string;

    @Column('json', { default: { [0]: 0 } })
    postIdHashMap: Record<number, number>;

    @Column({
        type: 'enum',
        enum: AccessLevel,
        default: AccessLevel.ADMIN,
    })
    @IsIn(Object.values(AccessLevel), {
        //check
        message: "Access level must be 'user' or 'admin'",
    })
    accessLevel: AccessLevel;

    @ManyToOne(() => UserModel, (user) => user.boards)
    @JoinColumn({ name: 'user_id' })
    author: UserModel;
}
