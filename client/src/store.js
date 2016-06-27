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
  // The application's locale.
  locale: 'en',
  // Indicates that the entity cache is ready to be used.
  typesLoaded: false,
  // Entity cache is not pluralized to better reflect types.
  entities: {},
  // The app store.
  app: app
}, {
  // Enable mutability to allow entity updates.
  mutable: true
  // Maybe enable live mode, not sure if necessary.
  // live: true
});

export default store;

/**
 * This helper simplifies the creation of reactions.
 * @param exports
 * @param name
 * @param handler
 * @param trigger
 */
export function createReaction(exports, name, handler, trigger) {
  store.on(name, handler);
  exports[name.replace(/:/g, '_')] = trigger ? trigger : (...args) => {
    store.trigger(name, ...args);
  };
}

/**
 * The access token to be used with every call to the GraphQL API.
 */
let _accessToken = '';

/**
 * Set the access token.
 */
export function setAccessToken(newAccessToken) {
  _accessToken = newAccessToken;
}

/**
 * The entity types from schema introspection.
 */
let _types = null;

/**
 * Send the ql query to a given endpoint and fetchQuery the results.
 * @param query The query language query string.
 * @param mergeCallback An optional callback to control the way the results are merged back into the entity cache.
 */
export function fetchQuery(query, mergeCallback) {
  return fetch(_CONFIG_.graphql.endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + _accessToken,
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({query: `{${query}}`})
  }).then(response => {
    return response.json().then(result => {
      function processNode(entities, node, nodeTypeName) {
        let nodeType = node.hasOwnProperty('__typename') ? _types[node.__typename] : _types[nodeTypeName];
        var entity = {};
        for (let nodePropName in node) {
          if (nodePropName === '__typename') {
            entity[nodePropName] = node[nodePropName];
            continue;
          }
          let nodePropType = nodeType.fields[nodePropName].type;
          let nodePropValue = node[nodePropName];
          switch (nodePropType.kind) {
            case 'SCALAR':
            case 'ENUM':
              entity[nodePropName] = nodePropValue;
              break;
            case 'OBJECT':
              entity[nodePropName] = processNode(entities, nodePropValue, nodePropType.name);
              break;
            case 'UNION':
              // TODO make sure there is a __typename and handle more than just UNIONs of OBJECTs here
              entity[nodePropName] = processNode(entities, nodePropValue);
              break;
            case 'LIST':
              switch (nodePropType.ofType.kind) {
                case 'SCALAR':
                case 'ENUM':
                  entity[nodePropName] = nodePropValue;
                  break;
                case 'OBJECT':
                  entity[nodePropName] = [];
                  nodePropValue.forEach(listItem => {
                    entity[nodePropName].push(processNode(entities, listItem, nodePropType.ofType.name));
                  });
                  break;
                case 'UNION':
                  entity[nodePropName] = [];
                  nodePropValue.forEach(listItem => {
                    // TODO include the type here, id is not enough
                    entity[nodePropName].push(processNode(entities, listItem));
                  });
                  break;
                case 'LIST':
                  switch (nodePropType.ofType.ofType.kind) {
                    case 'SCALAR':
                    case 'ENUM':
                      entity[nodePropName] = nodePropValue;
                      break;
                    // TODO support more than just SCALARs in LIST of LISTs
                  }
                  break;
              }
              break;
          }
        }
        // merge entity now into the entity cache with Object.assign
        // and allow a merge callback for special cases
        if (!entities.hasOwnProperty(nodeType.name)) {
          entities[nodeType.name] = {};
        }
        if (entities[nodeType.name].hasOwnProperty(entity.id)) {
          Object.assign(entities[nodeType.name][entity.id], entity);
        } else {
          entities[nodeType.name][entity.id] = entity;
        }
        return entity;
      }

      let state = store.get();
      let entities = state.entities.transact();
      var queryValue = processNode(entities, result.data, 'Query'); // TODO mergeCallback
      state.entities.run();
      return queryValue;
    });
  });
}

/**
 * Fetch all types provided by the schema.
 */
export function fetchTypes() {
  return fetch(_CONFIG_.graphql.endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + _accessToken,
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      query: `
      {
        __schema {
          types {
            name
            kind
            ofType {
              name
              kind
            }
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      }`
    })
  }).then(response => {
    return response.json().then(result => {
      return result.data.__schema.types.reduce((prev, curr) => {
        if (curr.kind === 'OBJECT') {
          curr.fields = curr.fields.reduce((prev, curr) => {
            prev[curr.name] = curr;
            return prev;
          }, {});
        }
        prev[curr.name] = curr;
        return prev;
      }, {});
    });
  }).then(types => {
    _types = types;
    let state = store.get();
    let entities = state.entities.transact();
    for (let typeName in _types) {
      if (_types[typeName].kind === 'OBJECT') {
        entities[typeName] = {};
      }
    }
    state.entities.run();
  });
}
