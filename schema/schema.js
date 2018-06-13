const graphql = require('graphql')
const axios = require('axios')

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema, // takes RootQuery and returns GraphQL Schema
	GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		//relationship
		users: {
			type: new GraphQLList(UserType), // tell GraphQL to associate multiple user
			resolve(parentValue, args) {
				console.log(parentValue.id)
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data)
			}
		}
	})
})

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		// relationship
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data)
			}
		}
	})
})

// Get specific record of all graphs of records
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },	// id as argument. Will be avaible at args in resolve
			// resolve() returns data
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(resp => resp.data)
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`)
					.then(res => res.data)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
})