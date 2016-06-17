/**
 * Manapaho (https://github.com/Manapaho/)
 *
 * Copyright © 2016 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Freezer from 'freezer-js';
import app from './app/store';

/**
 * The application's store.
 */
const store = new Freezer({
  locale: 'en',
  app: app,
  // Entity cache is not pluralized to better reflect types.
  entities: {}
}, {
  // Enable mutability to allow entity updates.
  mutable: true
  // Maybe enable live mode, not sure if necessary.
  // live: true
});

export default store;
