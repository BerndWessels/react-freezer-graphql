import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';

export default new GraphQLEnumType({
  name: 'Volume',
  values: {
    SILENT: {value: 0},
    MEDIUM: {value: 1},
    LOUD: {value: 2}
  }
});
