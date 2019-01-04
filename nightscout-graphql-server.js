const express = require('express');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


if (!process.env.MDB_CONNECTION_STRING
	|| process.env.MDB_CONNECTION_STRING && process.env.MDB_CONNECTION_STRING === '') {
	console.log('No data store connection string specified, make sure MDB_CONNECTION_STRING is set in your .env');
	process.exit(1);
}

const app = express();
const mdbc = process.env.MDB_CONNECTION_STRING;
MongoClient.connect(mdbc, { useNewUrlParser: true }, (error, client) => {
	if (error) {
		console.log(error);
		console.log('Or to paraphrase, something went wrong connecting to mongodb.');
		process.exit(1);
	}
	app.listen(4000, () => {
		console.log('Express Server Now Running On localhost:4000');
	});
});

// express server and gql endpoint

