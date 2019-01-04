const express = require('express');
const dotenv = require('dotenv').config();

if (!process.env.MDB_CONNECTION_STRING
	|| process.env.MDB_CONNECTION_STRING && process.env.MDB_CONNECTION_STRING === '') {
	console.log('No data store connection string specified, make sure MDB_CONNECTION_STRING is set in your .env');
	process.exit(1);
}

const mdbc = process.env.MDB_CONNECTION_STRING;


// express server and gql endpoint
const app = express();
app.listen(4000, () => console.log('Express Server Now Running On localhost:4000'));