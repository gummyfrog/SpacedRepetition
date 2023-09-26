const express = require('express')
const https = require('https');
const fs = require('fs');
// Temporary for faking Bridge
const json = require('jsonfile');
const ServiceDatabase = require('./ServiceDatabase.js')

module.exports = class Librarian {

	constructor() {
		this.database = new ServiceDatabase();

		this.port = 3000

		this.app = express()
		this.app.use(express.json());
		this.app.set('port', this.port);
		this.set_routes(this.app);
	}

	listen(callback) {
		this.server = https.createServer(this.certOpts, this.app);
		this.server.on('error', callback);
		this.server.listen(this.port, callback);
	}

	set_routes(app) {
		app.get('/', (req, res) => {
		  res.send('Hello World!');
		})


		app.get('/entries/:user', (req, res) => {
			this.database.find_entry(req.params.entryID)
			.then((result) => {
				console.log("Found entry", result);
				res.status(200).json(result);
			})
			.catch((err) => {
				console.log("Could not find entry:", err);
				res.status(400).json({err: err})
			})
		})

		/*
			Endpoint for Service Sidecars to report to.
		*/
		app.post('/entries/add/', (req, res) => {
			this.database.insert(req.body)
			.then((result)=>{
				res.status(200).send();
			})
			.catch((err) => {
				res.status(400).json({err: err});
			})
		})
	}
}