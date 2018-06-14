const graphql = require('graphql')
const axios = require('axios')

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema, // takes RootQuery and returns GraphQL Schema
	GraphQLList,
	GraphQLNonNull
} = graphql

const ROOT_URL = 'http://localhost:3000'

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
				return axios.get(`${ROOT_URL}/companies/${parentValue.id}/users`)
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
				return axios.get(`${ROOT_URL}/companies/${parentValue.companyId}`)
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
				return axios.get(`${ROOT_URL}/users/${args.id}`)
					.then(resp => resp.data)
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`${ROOT_URL}/companies/${args.id}`)
					.then(res => res.data)
			}
		}
	}
})

// Mutation
const mutation = new GraphQLObjectType({
	name: 'addUser',
	fields: {
		addUser: {
			type: UserType,
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post(`${ROOT_URL}/users`, { firstName, age })
					.then(res => res.data)
			}
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				return axios.delete(`${ROOT_URL}/users/${id}`)
					.then(res => res.data)
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
})