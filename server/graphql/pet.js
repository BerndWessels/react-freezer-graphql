import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';

import gqlCat from './cat';
import gqlDog from './dog';

export default new GraphQLUnionType({
  name: 'Pet',
  types: [gqlDog, gqlCat]
});
