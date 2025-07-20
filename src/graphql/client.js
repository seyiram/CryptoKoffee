import { GraphQLClient } from 'graphql-request';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/78954/cryptokoffee/v0.0.1';

export const graphqlClient = new GraphQLClient(SUBGRAPH_URL);

export default graphqlClient;