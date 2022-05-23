import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seePosts: offsetLimitPagination(),
        searchZone: offsetLimitPagination(),
        searchPost: offsetLimitPagination(),
      },
    },
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
});

export default client;
