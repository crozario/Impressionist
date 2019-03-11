// const express = require('express');
// const bodyParser = require('body-parser');
// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');

// const app = express();

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded( { extended: true }))

// // parse requests of content-type - application/json
// app.use(bodyParser.json())

// // database config

// mongoose.Promise = global.Promise;

// // connecting to database
// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Successful database connection.");    
// }).catch(err => {
//     console.log('Failed database connection. Exiting...', err);
//     process.exit();
// });


// // define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "Welcome to the User Database Rest API"});
// });

// // listen for requests
// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });


const MongoClient = require('mongodb').MongoClient;
const cred = require('./db_cred.js');
const bcrypt = require('bcrypt');
var express = require("express");
var myParser = require("body-parser");
var app = express();

app.use(myParser.urlencoded({extended : true}));

app.post("/requests", function(request, response) {

  // var userData = ['Jane', 'Doe', request.body.email, 'jane_doe', request.body.password, 3452, 2, Date("<YYYY-mm-ddTHH:MM:ss>")];
  console.log(request.body.email);
  console.log(request.body.password);
  const email = String(request.body.email);
  const password = String(request.body.password);
  var userData = [email. password];

  var hashPass = "";
  
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function(err, hash){
    hashPass = hash; 
    console.log(hashPass);
      MongoClient.connect(cred.url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("userDB");
    // var myobj = {firstName: userData[0], lastName: userData[1], credentials: {emailAddress: userData[2], username: userData[3], password: hashPass}, gameStats: {highScore: userData[5], rank: userData[6]}, lastLogin: userData[7]};
    var myobj = { email: email, password: hashPass };
    dbo.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("one document inserted");
      db.close();
    });
  });
  });

  



  // response.end(request.body);
});






app.listen(8080);