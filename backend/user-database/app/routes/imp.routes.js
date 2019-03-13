module.exports = (app) => {
	const imp = require('../controllers/imp.controller.js');

	// user sign-up
	app.post('/imp', imp.signUp);

	// user sign-in
	//app.put('./imp', imp.sigIn);

	// retrieve user data
	//app.get('./imp', imp.getUserData);
}