import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import mergedTypeDefs from './typeDefs/index.js';
import mergedResolver from './resolvers/mergedResolvers.js';
import { connectToDb } from './DBConfig/connect.js';
const app = express();
app.use(express.json());
app.use(cors());
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req })
}));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectToDb();
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
