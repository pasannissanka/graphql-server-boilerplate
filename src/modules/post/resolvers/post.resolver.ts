import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../models/post";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async getAllPosts(): Promise<Array<Post>> {
		return await Post.find({});
	}

	@Mutation(() => Post)
	async createPost(
		@Arg("title") title: string,
		@Arg("contnent") content: string
	): Promise<Post> {
		const post = Post.create({ content, title });
		try {
			await post.save();
		} catch (error) {}
		return post;
	}
}
