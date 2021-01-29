import { Field, ID, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO Add validation, auth decorators
@Entity()
@ObjectType()
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number | null = null;

	@Field(() => String)
	@Column({ unique: true })
	username!: string;

	@Field(() => String)
	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;
}
