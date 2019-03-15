const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = require('../models/imp.model.js');
// schema.Cred --> CredentialsSchema
// schema.Stat --> StatsSchema
// schema.Hist --> HistorySchema
// schema.User --> UserSchema


// verify that user-provided username is unique
exports.isUniqueUsername = (req,res) => {
	// validate request
	if(!req.body.username) {
		res.setHeader('Execution', 'failure');
		return res.status(400).json({
			message: "Need username"
		});
	}
	schema.User.findOne({'credentials.username': req.body.username})
		.then(exists => {
			res.setHeader('Execution', 'success');
			if(!exists) {
				return res.json({
					message: "user-provided username is unique"
				});
			} else {
				return res.json({
					message: "user-provided username already exists"
				});
			}
		}).catch(err => {
			res.setHeader('Execution', 'failure');
			return res.status(500).json({
				message: err.message || "Error retrieving information from the database"
			});
		});
};

// user sign-up, store basic sign-up information 
exports.signUp = (req,res) => {
	// validate request
	if(!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.username && !req.body.password) {
		res.setHeader('Execution', 'failure');
		return res.status(400).json({
			message: "Need user data at sign-up"
		});
	}
	// create a new user
	const cred = new schema.Cred({
		emailAddress: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	const user = new schema.User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		credentials: cred,
		lastLogin: Date("<YYYY-mm-ddTHH:MM:ss>")
	});
	// store user information in the database 
	user.save()
	.then(data => {
		res.setHeader('Execution', 'success');
		res.json(data);
	}).catch(err => {
		res.setHeader('Execution', 'failure');
		res.status(500).json({
			message: err.message || "Some error occured while storing the user's information."
		});
	});
};

// user sign-in, verify that user-provided username/email exists and check password
exports.signIn = (req,res) => {
	// validate request
	if(!req.body.email && !req.body.username && !req.body.password) {
		res.setHeader('Execution', 'failure');
		return res.status(400).json({
			message: "Need user data at sign-up"
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
			res.setHeader('Execution','failure');
			return res.status(500).json({
				message: err.message || "Some error occured"
			});
		}
		// compare user-provided password with the hashed password from db, doc.credentials.password
		console.log(doc.credentials.password);
		console.log(req.body.password);
		bcrypt.compare(req.body.password,doc.credentials.password,function(err,result) {
			if(err) {
				res.setHeader('Execution', 'failure');
				return res.status(500).json({
					message: err.message || "Some error occured"
				});
			}
			res.setHeader('Execution', 'success');
			if(result == true) {
				doc.lastLogin = Date("<YYYY-mm-ddTHH:MM:ss>");
				doc.save();
				res.json(result);
			} else {
				console.log(result);
				res.json({
					message: "password does not match; user is not allowed to log-in"
				});
			}
		});
	});
};