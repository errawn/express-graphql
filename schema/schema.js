const graphql = require('graphql')
const _ = require('lodash')

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema // takes RootQuery and returns GraphQL Schema
} = graphql

const users = [
	{ id: 1, firstName: 'Warren', age: 20 },
	{ id: 2, firstName: 'Ed', age: 17 }
]

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLInt },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
})

// Get specific record of all graphs of records
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLInt } },	// id as argument. Will be avaible at args in resolve
			resolve(parentValue, args) {
				// look through users array and find record with same id
				return _.find(users, { id: args.id }) 
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
})