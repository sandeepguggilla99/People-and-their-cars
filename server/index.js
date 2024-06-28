const express = require("express");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const { typeDefs, resolvers } = require("./schema");

const cors = require("cors");
const bodyParser = require("body-parser");

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,

    resolvers,
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser.json());

  app.use("/graphql", expressMiddleware(server));

  app.listen({ port: 4000 }, () =>
    console.log(`Server opened at http://localhost:4000/graphql`)
  );
};

startServer();
