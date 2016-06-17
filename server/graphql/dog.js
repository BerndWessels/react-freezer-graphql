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
import gqlHuman from './human';

export default new GraphQLObjectType({
  name: 'Dog',
  isTypeOf: obj => obj.__typename === 'Dog',
  fields: () => ({
    id: {type: GraphQLInt},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    bark: {type: gqlVolume},
    owner: {type: gqlHuman}
  })
});
