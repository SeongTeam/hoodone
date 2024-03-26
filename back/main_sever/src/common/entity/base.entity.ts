import { Exclude, Expose } from "class-transformer/types/decorators";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// 필요시 @Expose({ groups: ['post'] })을 사용해서 
// BaseModel에서 보여질 값을 정하자
export abstract class BaseModel{
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;
}