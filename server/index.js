import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';

import config from './config';
import schema from './graphql/schema';

const GRAPHQL_PORT = config.graphql.port;

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP(request => ({
  schema: schema,
  context: {accessToken: 'willbeusedtoaccessstuff'},
  graphiql: true
})));

app.listen(GRAPHQL_PORT, () => console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`));
