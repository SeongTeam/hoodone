// import { Board } from "src/boards/board.entity";
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { passwordValidationMessage } from 'src/common/validation-message/password-vaildation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { CommentModel } from 'src/posts/comment/entities/comment.entity';
import { RoleType } from '../const/role.type';

@Entity('temporaryUser')
export class TempUserModel extends BaseModel {
    @Column({ unique: true })
    @IsString({ message: stringValidationMessage })
    @IsEmail({}, { message: emailValidationMessage })
    email: string; // 1) 유일무이한 값이 될 것

    @Column()
    isVerfied: boolean;

    @Column()
    pinCode: String;
}
