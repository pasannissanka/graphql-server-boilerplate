import { FieldError } from  "../../common/types/Error.types"
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../models/User";

@InputType()
export class RegisterUserInput {
	@Field()
	username!: string;
	@Field()
	email!: string;
	@Field()
	password!: string;
}

@InputType()
export class LoginUserInput {
	@Field()
	emailOrUserName!: string;
	@Field()
	password!: string;
}

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
	@Field(() => String, { nullable: true })
	token?: string;
}

