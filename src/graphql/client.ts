import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { store } from "../redux/store";
import { setContext } from "@apollo/client/link/context";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:5000/graphql",
  })
);

// The split function takes three parameters:

//

// * A function that's called for each operation to execute

// * The Link to use for an operation if the function returns a "truthy" value

// * The Link to use for an operation if the function returns a "falsy" value

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },

  wsLink,

  httpLink
);

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const cache = new InMemoryCache({ addTypename: false });

export const client = new ApolloClient({
  link: authLink.concat(splitLink),

  cache,

  name: "tasks-web-client",

  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  },
});
