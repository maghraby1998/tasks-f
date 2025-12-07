import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { store } from "../redux/store";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
// @ts-ignore
import { createUploadLink } from "apollo-upload-client";
import config from "../config";

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:5000/graphql",
  })
);

// Upload-capable HTTP link
const httpLink = createUploadLink({
  uri: `${config.API_URI}/graphql`,
  headers: {
    // you can set static headers here if needed
    "x-apollo-operation-name": "UploadFile",
  },
});

// Split link: use wsLink for subscriptions, httpLink for queries/mutations
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

// Auth middleware
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
