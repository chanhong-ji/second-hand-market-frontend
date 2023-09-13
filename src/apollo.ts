import { ApolloClient, InMemoryCache, makeVar, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import {
  getMainDefinition,
  offsetLimitPagination,
} from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import config from './config';

const TOKEN = 'token';
export const LoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const tokenVar = makeVar(localStorage.getItem(TOKEN));

export const getUserLogin = async (token: string) => {
  LoggedInVar(true);
  tokenVar(token);
  await localStorage.setItem(TOKEN, token);
};

export const getUserLogout = async () => {
  LoggedInVar(false);
  tokenVar('');
  await localStorage.removeItem(TOKEN);
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
    Room: {
      fields: {
        messages: offsetLimitPagination(),
      },
    },
    Query: {
      fields: {
        searchZone: offsetLimitPagination(),
      },
    },
  },
});

const httpLink = createUploadLink({
  uri: config.service.host,
});
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

const wsLink = new WebSocketLink(
  new SubscriptionClient(config.service.subscriptionHost, {
    connectionParams: () => ({
      token: localStorage.getItem(TOKEN),
    }),
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(errorLink).concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
