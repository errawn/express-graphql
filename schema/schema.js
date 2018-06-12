const graphql = require('graphql')
const axios = require('axios')

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema // takes RootQuery and returns GraphQL Schema
} = graphql

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
			// resolve() returns data
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(resp => resp.data)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
})