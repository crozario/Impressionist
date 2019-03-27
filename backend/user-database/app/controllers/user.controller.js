const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = require('../models/user.model.js');
// schema.Cred --> CredentialsSchema
// schema.Stat --> StatsSchema
// schema.Hist --> HistorySchema
// schema.User --> UserSchema


// verify that user-provided username is unique
exports.isUniqueUsername = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.username) {
		return res.status(400).json({
			status: "failure",
			error: "a username was not provided"
		});
	}
	schema.User.findOne({'credentials.username': info.username})
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
	const info = req.body;
	// validate request
	if(!info.firstName || !info.lastName || !info.email || !info.username || !info.password) {
		return res.status(400).json({
			status: "failure",
			error: "some or all required fields were not provided"
		});
	}

	schema.User.findOne({'credentials.emailAddress': info.email})
	.then(exists => {
		if(exists) {
			return res.status(400).json({
				status: "failure",
				error: "an account with the user-provided email address already exists"
			});
		} else {
			// create a new user
			const cred = new schema.Cred({
				emailAddress: info.email,
				username: info.username,
				password: info.password
			});
			const user_s = new schema.User({
				firstName: info.firstName,
				lastName: info.lastName,
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
		}
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error retrieving information from the database"
		});
	});
};

// user sign-in, verify that user-provided username/email exists and check password
exports.signIn = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.user && !info.password) {
		return res.status(400).json({
			status: "failure",
			error: "username or password was not provided"
		});
	}
	// build query based on whether the user signed-in with email or username
	if((info.user).includes("@")) {
		// res.setHeader('type', 'emailAddress');
		var query = schema.User.findOne({'credentials.emailAddress': info.user});
	} else {
		// res.setHeader('type', 'username');
		var query = schema.User.findOne({'credentials.username': info.user});
	}
	query.exec(function(err,doc) {
		if(err) {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when retrieving information from the database"
			});
		}
		// compare user-provided password with the hashed password from db, doc.credentials.password
		bcrypt.compare(info.password,doc.credentials.password,function(err,result) {
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
	const info = req.body;
	// validate request
	if(!info.username || !info.netflixWatchID) {
		return res.status(400).json({
			status: "failure",
			error: "a username or contentID was not provided"
		});
	}
	// find user's document in the userDB
	var query = schema.User.findOne({'credentials.username': info.username});
	query.exec(function(err,doc) {
		if(err) {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when retrieving information from the database"
			});
		}
		// create game History schema to update user's document with
		const history = new schema.Hist({
			netflixWatchID: info.netflixWatchID,
			completed: false,
			activity: Date("<YYYY-mm-ddTHH:MM:ss>"),
			scores: []
		});
		// save data in gameHistory field array
		doc.gameHistory.push(history);
		doc.save()
		.then(data => {
			return res.json({
				status: "success",
				gameID: data.gameHistory[0]._id
			});
		}).catch(err => {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when saving user game data into database"
			});
		}); 
	});
};

// store user score data
exports.storeScoreData = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.username || !info.score || !info.gameID) {
		return res.status(400).json({
			status: "failure",
			error: "username, dialogueID, gameID, or score were not provided"
		});
	}
	// find the user's game document connected to the given gameID and store/update data
	var query = schema.User.findOne({'credentials.username': info.username});
	query.exec(function(err,doc) {
		if(err) {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when retrieving information from the database"
			});
		}
		// save data in the document
		const score_data = new schema.Score({
			score: info.score,
			dialogueID: info.dialogueID
		});
		doc.gameHistory.id(mongoose.Types.ObjectId(info.gameID)).score = score_data;
		doc.save()
		.then(data => {
			return res.json({
				status: "success"
			});
		}).catch(err => {
			return res.status(500).json({
				status: "failure",
				error: err.message || "error occured when saving user score data into database"
			});
		});
	});
};