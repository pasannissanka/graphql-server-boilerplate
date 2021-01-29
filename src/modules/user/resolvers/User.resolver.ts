import argon2 from "argon2";
import {
	Arg,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { User } from "../models/User";

@InputType()
class RegisterUserInput {
	@Field()
	username!: string;
	@Field()
	email!: string;
	@Field()
	password!: string;
}

@InputType()
class LoginUserInput {
	@Field()
	emailOrUserName!: string;
	@Field()
	password!: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
}

@ObjectType()
class FieldError {
	@Field(() => String, { nullable: true })
	message?: string;
	@Field(() => String, { nullable: true })
	field?: string;
}

@Resolver()
export class UserResolver {
	@Query(() => [User])
	async getAllUsers(): Promise<Array<User>> {
		return User.find();
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("input") input: RegisterUserInput
	): Promise<UserResponse> {
		const hashedPassword = await argon2.hash(input.password);
		const user = User.create({
			username: input.username,
			email: input.email,
			password: hashedPassword,
		});
		try {
			await user.save();
		} catch (error) {
			console.log(error.detail);
			if (error.detail.includes("already exists")) {
				return {
					errors: [
						{
							message: "username/email already exisits",
							field: "username/email",
						},
					],
				};
			}
			return {
				errors: [
					{
						message: "Registration error",
						field: "",
					},
				],
			};
        }
        // TODO set jwt token
		return {
			user,
		};
	}

	@Mutation(() => UserResponse)
	async login(@Arg("input") input: LoginUserInput): Promise<UserResponse> {
		const user = await User.findOne({
			where: [
				{ email: input.emailOrUserName },
				{ username: input.emailOrUserName },
			],
		});
		if (!user) {
			return {
				errors: [
					{
						message: "user not found",
						field: "email/username",
					},
				],
			};
		}
		const isValid = await argon2.verify(user.password, input.password);
		if (!isValid) {
			return {
				errors: [
					{
						message: "invalid login",
						field: "password",
					},
				],
			};
        }
        // TODO set jwt token
		return {
			user,
		};
	}
}
