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

const port = process.env.SERVER_PORT || 4000;

const start = async () => {
	try {
		const mdbc = process.env.MDB_CONNECTION_STRING;
		const client = await new MongoClient(mdbc, { useNewUrlParser: true }).connect();
		const db = client.db('ddamico_nightscout_db');
		const Entries = db.collection('entries');

		const schema = buildSchema(`
			type Query {
				entry(id: ID!): Entry
				entries(lastN: Int, startTimestamp: String, endTimestamp: String): [Entry]
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
						return await Entries.findOne(ObjectId(args.id));
					} catch (error) {
						console.log('Error getting entry by id');
						console.log(error);
					}
				} else {
					return null;
				}
			},
			entries: async ({ lastN, startTimestamp, endTimestamp }) => {
				const upperLimit = parseInt(process.env.MAX_ENTRIES) || 288;

				if (lastN) {
					// 288 here is (60/5) * 24, or a day's worth of entries
					const limit = (lastN > upperLimit) ? upperLimit : limit;

					try {
						return await Entries.find().sort({_id:-1}).limit(limit).toArray();
					} catch (error) {
						console.log('Error getting entries');
						console.log(error);
					}
				} else if (startTimestamp) {
					// if we are passed a start date alone, return all entries
					// since that date
					const startTimestampInt = parseInt(startTimestamp);
					if (!endTimestamp) {
						try {
							return await Entries.find({
								date: {
									$gte: startTimestampInt
								}
							}).sort({_id:-1}).limit(upperLimit).toArray();
						} catch (error) {
							console.log('Error getting entries');
							console.log(error);
						}
					} else {
						const endTimestampInt = parseInt(endTimestamp);
						try {
							return await Entries.find({
								date: {
									$gte: startTimestampInt,
									$lte: endTimestampInt
								}
							}).sort({_id:-1}).limit(upperLimit).toArray();
						} catch (error) {
							console.log('Error getting entries');
							console.log(error);
						}
					}

					// if we are passed a start date and an end date, return
					// entries in that range
				} else {
					// default to returning last 10 entries, this matches
					// REST endpoint's behaviour
					try {
						return await Entries.find().sort({_id:-1}).limit(10).toArray();
					} catch (error) {
						console.log('Error getting entries');
						console.log(error);
					}
				}

			}
		};

		const app = express();
		app.use('/graphql', express_graphql({
			schema,
			rootValue: resolvers,
			graphiql: true
		}));
		app.listen(port, () => console.log('Express GraphQL Server Now Running On localhost:' + port + '/graphql'));

	} catch (error) {
		console.log('Error connecting to data store');
		console.log(error);
		process.exit(1);
	}
};

start();