import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO Add validation, auth decorators
@Entity()
@ObjectType()
export class Post extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number | null = null;

	@Field(() => String)
	@Column()
	title: string;

	@Field(() => String)
	@Column()
	content: string;
}
