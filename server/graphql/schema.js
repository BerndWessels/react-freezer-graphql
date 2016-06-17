import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';

import gqlHuman from './human';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      human: {
        type: gqlHuman,
        args: {
          id: {type: GraphQLString}
        },
        resolve: function (_, {id}) {
          return {
            id: id,
            firstName: 'first name',
            lastName: 'last name',
            favouritePet: {
              __typename: 'Cat',
              id: 1,
              name: 'Bonkers',
              age: 33,
              meeaaoo: 2
            },
            pets: [{
              __typename: 'Cat',
              id: 1,
              name: 'Bonkers',
              age: 33,
              meeaaoo: 2
            }, {
              __typename: 'Dog',
              id: 2,
              name: 'Madster',
              age: 44,
              bark: 0,
              owner: {
                id: 99,
                firstName: 'first blame',
                lastName: 'last blame',
                favouritePet: null,
                pets: []
              }
            }],
            dogs: [{
              __typename: 'Dog',
              id: 2,
              name: 'Madster',
              age: 44,
              bark: 0
            }],
            numbers: [[1,2,3],[4,5,6]]
          };
        }
      }
    })
  })
});
