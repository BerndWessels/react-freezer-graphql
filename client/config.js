/**
 * Manapaho (https://github.com/Manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Export the configuration.
 */
export default {
  baseurl: process.env.BASEURL || '/',
  graphql: {
    endpoint: process.env.GRAPHQLENDPOINT || 'http://localhost:8088/graphql'
  }
}
