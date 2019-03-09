const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( { extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// database config

mongoose.Promise = global.Promise;

// connecting to database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successful database connection.");    
}).catch(err => {
    console.log('Failed database connection. Exiting...', err);
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the User Database Rest API"});
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});


