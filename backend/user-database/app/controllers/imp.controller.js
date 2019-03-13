const schema = require('../models/imp.model.js');

// user sign-up, store basic sign-up information 
exports.signUp = (req,res) => {
	
	const bcrypt = require('bcrypt');

	// validate request
	if(!req.body.firstName && !req.body.lastName && !req.body.email && !req.body.username && !req.body.password) {
		return res.status(400).send({
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
		res.send(data);
	}).catch(err => {
		res.status(500).send({
			message: err.message || "Some error occured while storing the user's information."
		});
	});
};