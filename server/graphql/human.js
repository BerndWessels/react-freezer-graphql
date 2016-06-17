import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';

import gqlPet from './pet';
import gqlDog from './dog';

export default new GraphQLObjectType({
  name: 'Human',
  fields: () => ({
    id: {type: GraphQLInt},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    favouritePet: {type: gqlPet},
    pets: {type: new GraphQLList(gqlPet)},
    dogs: {type: new GraphQLList(gqlDog)},
    numbers: {type: new GraphQLList(new GraphQLList(GraphQLInt))}
  })
});
