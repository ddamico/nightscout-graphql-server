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
const client = new MongoClient(mdbc, { useNewUrlParser: true });
client.connect((error) => {
	if (error !== null) {
		console.log("Connection error");
	}
	console.log("Connected successfully to server");
	const db = client.db('ddamico_nightscout_db');

	findEntries(db, function (docs) {
		console.log(docs);
	});
});
const findEntryById = function (db, callback) {
	// @TODO implementation
};
const findEntries = function(db, callback) {
	const collection = db.collection('entries');
	console.log('findEntries called', collection);
	collection.find({}).toArray(function (error, docs) {
		callback(docs);
	});
};
const getLastTenEntries = function(db, callback) {
	// @TODO implementation
};