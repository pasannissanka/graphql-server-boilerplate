import "reflect-metadata"
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers'
import express from 'express'
import { createConnection } from 'typeorm';
// import { printSchema } from 'graphql';
// import * as fs from 'fs'

const PORT = 4001;

const main = async () => {
    // await init_db();
    const connection = await createConnection();
    console.log('Database created')

    const schema = await buildSchema({
        resolvers: [UserResolver]
    })

    // const sdl = printSchema(schema);
    // console.log(sdl)
    // fs.writeFileSync(__dirname + '/schema.graphql', sdl);

    const apolloServer = new ApolloServer({ schema })
    const app = express();

    app.get('/', (req, res) => {
        res.send("Hi")
    })

    apolloServer.applyMiddleware({ app })
    app.listen(PORT, () => {
        console.log(`server started at port ${PORT}`)
    })
}

main();