import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';

export const LoggedInVar = makeVar(Boolean(localStorage.getItem('token')));
export const tokenVar = makeVar(localStorage.getItem('token'));
export const zoneIdVar = makeVar(localStorage.getItem('zoneId') ?? 1);

export const getUserLogin = async (token: string) => {
  LoggedInVar(true);
  tokenVar(token);
  zoneIdVar(localStorage.getItem('zoneId') ?? 1);
  await localStorage.setItem('token', token);
};

export const getUserLogout = async () => {
  LoggedInVar(false);
  tokenVar('');
  await localStorage.removeItem('token');
  window.location.reload();
  window.location.href = '/';
};

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        posts: offsetLimitPagination(),
      },
    },
    Query: {
      fields: {
        searchZone: offsetLimitPagination(),
        searchPost: offsetLimitPagination(),
      },
    },
  },
});

const httpLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache,
});

export default client;
