import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, Resolver } from "type-graphql";
import { PostResolver, UserResolver } from "./resolvers";
import express, { NextFunction, Response, Request, Errback } from "express";
import * as jwt from "express-jwt";
import { createConnection } from "typeorm";

const PORT = 4001;
const PATH = "/graphql";

const main = async () => {
	await createConnection();

	const app = express();

	const schema = await buildSchema({
		resolvers: [PostResolver, UserResolver],
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }) => {
			const context = {
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
			secret: "efefefwgrwgsdf",
			credentialsRequired: false,
		})
	);

	apolloServer.applyMiddleware({ app, path: PATH });

	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		res.status(err.status).json(err);
	});

	app.listen(PORT, () => {
		console.log(`server started at port ${PORT}`);
	});
};

main();
