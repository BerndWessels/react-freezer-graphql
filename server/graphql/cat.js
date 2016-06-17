import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';

import gqlVolume from './volume';

export default new GraphQLObjectType({
  name: 'Cat',
  isTypeOf: obj => obj.__typename === 'Cat',
  fields: () => ({
    id: {type: GraphQLInt},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    meeaaoo: {type: gqlVolume}
  })
});
