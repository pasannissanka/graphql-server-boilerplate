require('dotenv').config();
import "reflect-metadata";
import express from "express";
import * as jwt from "express-jwt";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { PostResolver, UserResolver } from "./resolvers";
import { customAuthChecker } from "./modules/common/authChecker";
import { ContextType } from "./modules/common/types/Context.type";

const PORT = process.env.PORT as string;
const PATH = process.env.GRAPHQLPATH as string;

const main = async () => {
	await createConnection();

	const app = express();

	const schema = await buildSchema({
		resolvers: [PostResolver, UserResolver],
		authChecker: customAuthChecker,
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => {
			const context: ContextType = {
				req,
				user: (req as any).user,
			};
			return context;
		},
		debug: process.env.NODE_ENV !== 'production'
	});

	app.get("/", (_, res) => {
		res.send("Hi");
	});

	app.use(
		PATH,
		jwt.default({
			algorithms: ["HS256"],
			secret: process.env.SECRET_KEY as string,
			credentialsRequired: false,
		})
	);

	apolloServer.applyMiddleware({ app, path: PATH });


	app.listen(PORT, () => {
		console.log(`🚀 Server started at http://localhost:${PORT}`);
		console.log(`🚀 GraphQL server at http://localhost:${PORT}${PATH}`);
	});
};

main();
