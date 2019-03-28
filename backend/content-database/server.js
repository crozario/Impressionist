const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3002;

// create express app
const app = express();

// added CORS(Cross-Origin Resource Sharing) headers 
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

// configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
	console.log("Successfully connected to the Content Database");
}).catch(err => {
	console.log("Could not connect to the Content Database. Exiting now...", err);
	process.exit();
});

// define a simple route
app.get('/', (req,res) => {
	res.json({"message": "Welcome to Impressionist!"})
});

// require Content routes
require("./app/routes/cont.routes.js")(app);

// listen for requests
app.listen(PORT, () => {
	console.log("Content Database Server is listening on port "+PORT);
});