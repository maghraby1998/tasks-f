import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",

  cache: new InMemoryCache({ addTypename: false }),

  name: "tasks-web-client",

  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  },
});
