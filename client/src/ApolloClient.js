// Author
// Sandeep Guggilla

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";

/* This code snippet is setting up an Apollo Client for making GraphQL requests in a React application. */
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const ApolloClientProvider = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloClientProvider;
