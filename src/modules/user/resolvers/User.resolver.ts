import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../models/User";



@Resolver()
export class UserResolver {

    @Query(() => String)
    async sayHello() {
        return "Hello"
    }

    @Query(() => [User])
    async getAllUsers() {
        return User.find()
    }


    @Mutation(() => User)
    async createUser(
        @Arg('username') username: string,
        @Arg('email') email: string,
        @Arg('password') password: string): Promise<User> {
        const user = User.create({ username, email, password })

        await user.save()
        return user
    }
}