/**
 * Manapaho (https://github.com/Manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import dependencies.
 */
import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';

/**
 * Import the application configuration for the environment.
 */
import env from './env';

/**
 * Import the GraphQL schema.
 */
import schema from './graphql/schema';

/**
 * Run the GraphQL server endpoint.
 */
// Get the port from the config.
const GRAPHQL_PORT = env.graphql.port;

// Create the app server.
const app = express();

// We support Cross Origin requests.
app.use(cors());

// Use the GraphQL server.
app.use('/graphql', graphqlHTTP(request => ({
  schema: schema,
  context: {accessToken: 'willbeusedtoaccessstuff'},
  graphiql: true
})));

// Start the server.
app.listen(GRAPHQL_PORT, () => console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`));
