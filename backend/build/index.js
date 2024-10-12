import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import mergedTypeDefs from './typeDefs/index.js';
import mergedResolver from './resolvers/mergedResolvers.js';
import { connectToDb } from './DBConfig/connect.js';
import { buildContext } from 'graphql-passport';
import passport from 'passport';
import connectMongo from 'connect-mongodb-session';
import session from 'express-session';
import { configurePassport } from './passport/passport.js';
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL environment variable is required');
}
if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}
const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
configurePassport();
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
const MongoStore = connectMongo(session);
const store = new MongoStore({
    uri: MONGO_URL,
    collection: "session",
});
store.on("error", (err) => console.log(err));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    },
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());
await server.start();
//middleware setup
app.use('/graphql', cors({
    origin: "http://localhost:3000",
    credentials: true
}), express.json(), expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res })
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectToDb();
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
