module.exports = (app) => {
	const user = require('../controllers/user.controller.js');

	// user sign-up
	app.post('/user/signUp', user.signUp);

	// verify that user-provided username is unique
	app.post('/user', user.isUniqueUsername);

	// user sign-in
	app.post('/user/signIn', user.signIn);

	// game initialization
	app.post('/user/initializeGame', user.initializeGame);
}