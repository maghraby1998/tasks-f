import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { store } from "../redux/store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache({ addTypename: false }),

  name: "tasks-web-client",

  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  },
});
