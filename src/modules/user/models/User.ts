import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO Add validation, auth decorators
@Entity()
@ObjectType()
export class User extends BaseEntity {

    @Field(()=> ID)
    @PrimaryGeneratedColumn()
    id: number | null = null;

    @Field(() => String)
    @Column()
    username!: string;

    @Field(() => String)
    @Column()
    email!: string;

    @Field(() => String)
    @Column()
    password!: string;
}