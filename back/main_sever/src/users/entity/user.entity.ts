// import { Board } from "src/boards/board.entity";
import { Exclude, Expose } from 'class-transformer'
import { IsEmail, IsString, Length, Matches } from 'class-validator'
import { BaseModel } from 'src/common/entity/base.entity'
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message'
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message'
import { passwordValidationMessage } from 'src/common/validation-message/password-vaildation.message'
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
@Exclude({ toPlainOnly: true })
export class User extends BaseModel {
  @Expose()
  @Column({ length: 20, unique: true })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string // 1) 유일무이한 값이 될 것

  @Expose()
  @Column({ unique: true })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string // 1) 유일무이한 값이 될 것

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(4, 20, { message: lengthValidationMessage })
  //영어랑 숫자만 가능한 유효성 체크
  // todo 회원가입할때 비밀번호 규칙을 적용해야 한다. DB에 적용할 필요 x
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: passwordValidationMessage,
  })
  password: string
}
