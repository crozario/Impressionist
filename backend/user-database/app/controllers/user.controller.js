const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = require('../models/user.model.js');
// schema.Cred --> CredentialsSchema
// schema.Stat --> StatsSchema
// schema.Hist --> HistorySchema
// schema.User --> UserSchema


// verify that user-provided username is unique
exports.isUniqueUsername = (req,res) => {
	// validate request
	if(!req.body.username) {
		return res.status(400).json({
			status: "failure",
			error: "a username was not provided"
		});
	}
	schema.User.findOne({'credentials.username': req.body.username})
		.then(exists => {
			if(!exists) {
				return res.json({
					status: "success"
				});
			} else {
				return res.json({
					status: "failure",
					error: "the username provided is already taken"
				});
			}
		}).catch(err => {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error retrieving information from the database"
			});
		});
};

// user sign-up, store basic sign-up information 
exports.signUp = (req,res) => {
	// validate request
	if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.username || !req.body.password) {
		return res.status(400).json({
			status: "failure",
			error: "some or all required fields were not provided"
		});
	}
	// create a new user
	const cred = new schema.Cred({
		emailAddress: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	const user_s = new schema.User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		credentials: cred,
		lastLogin: Date("<YYYY-mm-ddTHH:MM:ss>")
	});
	// store user information in the database 
	user_s.save()
	.then(data => {
		return res.json({
			status: "success",
			info: data
		});
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error occured while storing information in the database"
		});
	});
};

// user sign-in, verify that user-provided username/email exists and check password
exports.signIn = (req,res) => {
	// validate request
	if(!req.body.user && !req.body.password) {
		return res.status(400).json({
			status: "failure",
			error: "username or password was not provided"
		});
	}
	// build query based on whether the user signed-in with email or username
	if((req.body.user).includes("@")) {
		// res.setHeader('type', 'emailAddress');
		var query = schema.User.findOne({'credentials.emailAddress': req.body.user});
	} else {
		// res.setHeader('type', 'username');
		var query = schema.User.findOne({'credentials.username': req.body.user});
	}
	query.exec(function(err,doc) {
		if(err) {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when retrieving information from the database"
			});
		}
		// compare user-provided password with the hashed password from db, doc.credentials.password
		bcrypt.compare(req.body.password,doc.credentials.password,function(err,result) {
			if(err) {
				return res.status(500).json({
					status: "failure",
					error: err.message || "error occured when comparing passwords"
				});
			}
			if(result == true) {
				doc.lastLogin = Date("<YYYY-mm-ddTHH:MM:ss>");
				doc.save();
				return res.json({
					status: "success",
					info: result
				});
			} else {
				return res.json({
					status: "failure",
					error: "user-provided password does not match"
				});
			}
		});
	});
};

// initialize game
exports.initializeGame = (req,res) => {
	// validate request
	if(!req.body.username || !req.body.contentID) {
		return res.status(400).json({
			status: "failure",
			error: "a username or mediaID was not provided"
		});
	}
	// find user's document in the userDB
	var query = schema.User.findOne({'credentials.username': req.body.username});
	query.exec(function(err,doc) {
		if(err) {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when retrieving information from the database"
			});
		}
		// create game History schema to update user's document with
		const history = new schema.Hist({
			contentID: req.body.contentID,
			mediaType: req.body.mediaType,
			difficulty: req.body.difficulty,
			completed: false,
			activity: Date("<YYYY-mm-ddTHH:MM:ss>"),
			score: 0,
			averageAccuracy: 0
		});
		// save data in gameHistory field array
		doc.gameHistory = history;
		doc.save()
		.then(data => {
			console.log(data.gameHistory[0]._id+"       "+data.gameHistory[0].contentID);
			return res.json({
				status: "success",
				gameID: data.gameHistory[0]
			});
		}).catch(err => {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when saving user game data into database"
			});
		}); 
	});
};