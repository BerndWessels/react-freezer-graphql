/**
 * Manapaho (https://github.com/Manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Export the application configuration for the current build.
 *
 * Each build target can have different values provided via environment variables by the build process.
 * This means that you can have different values for local development and production builds.
 * You can also have different values for different production targets, like API endpoints, BaseURLs and so on.
 * In the package.json scripts you can provide these values via cross-env too. 
 */
export default {
  baseurl: process.env.BASEURL,
  graphql: {
    endpoint: process.env.GRAPHQLENDPOINT
  }
}
