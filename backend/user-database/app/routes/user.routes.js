module.exports = (app) => {
	const user = require('../controllers/user.controller.js');

	// user sign-up
	app.post('/user/signUp', user.signUp);

	// verify that user-provided username is unique
	app.get('/user', user.isUniqueUsername);

	// user sign-in
	app.get('/user/signIn', user.signIn);

	// game initialization
	app.get('/user/initializeGame', user.initializeGame);
}