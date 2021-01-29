import "reflect-metadata";
require('dotenv').config();
import { ApolloServer } from "apollo-server-express";
import { buildSchema, Resolver } from "type-graphql";
import { PostResolver, UserResolver } from "./resolvers";
import express, { NextFunction, Response, Request, Errback } from "express";
import * as jwt from "express-jwt";
import { createConnection } from "typeorm";
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
				user: (req as any).user, // `req.user` comes from `express-jwt`
			};
			return context;
		},
	});

	app.get("/", (req, res) => {
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

	app.use((err: any, _: Request, res: Response, __: NextFunction) => {
		res.status(err.status).json(err);
	});

	app.listen(PORT, () => {
		console.log(`🚀 Server started at http://localhost:${PORT}`);
		console.log(`🚀 GraphQL server at http://localhost:${PORT}${PATH}`);
	});
};

main();
