import { createHttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/link-context";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("auth.token");

  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  return { headers };
});

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
