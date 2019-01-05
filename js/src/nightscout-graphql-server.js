const express = require('express');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
ObjectId.prototype.valueOf = function () {
	return this.toString();
}
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

if (!process.env.MDB_CONNECTION_STRING
	|| process.env.MDB_CONNECTION_STRING && process.env.MDB_CONNECTION_STRING === '') {
	console.log('No data store connection string specified, make sure MDB_CONNECTION_STRING is set in your .env');
	process.exit(1);
}

const start = async () => {
	try {
		const mdbc = process.env.MDB_CONNECTION_STRING;
		const client = await new MongoClient(mdbc, { useNewUrlParser: true }).connect();
		const db = client.db('ddamico_nightscout_db');
		const Entries = db.collection('entries');

		const schema = buildSchema(`
			type Query {
				entry(id: ID!): Entry
				entries(lastN: Int): [Entry]
			},
			enum Direction {
				NONE,
				DoubleUp,
				SingleUp,
				FortyFiveUp,
				Flat,
				FortyFiveDown,
				SingleDown,
				DoubleDown
			},
			type Entry {
				_id: ID
				sgv: Int
				date: String
				dateString: String
				trend: Int
				direction: Direction
				device: String
				type: String
			}
		`);

		const resolvers = {
			entry: async (args) => {
				if (args.id) {
					try {
						const entry = await Entries.find({
							"_id": ObjectId(args.id)
						});
						console.log(entry);
						return entry;
					} catch (error) {
						console.log('Error getting entry by id');
						console.log(error);
					}
				} else {
					return null;
				}
			},
			entries: async (args) => {
				const limit = args.lastN || 10;
				try {
					return await Entries.find().sort({_id:-1}).limit(limit).toArray();
				} catch (error) {
					console.log('Error getting entries');
					console.log(error);
				}
			}
		};

		const app = express();
		app.use('/graphql', express_graphql({
			schema,
			rootValue: resolvers,
			graphiql: true
		}));
		app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

	} catch (error) {
		console.log('Error connecting to data store');
		console.log(error);
		process.exit(1);
	}
};

start();