module.exports = (app) => {
	const cont = require('../controllers/cont.controller.js');

	// adding to content database
	app.post('/cont', cont.insertIntoContentDB);

	// retrieve content for game play
	app.post('/cont/play', cont.gamePlay);

	// retrieve all data from content document
	app.post('/cont/retrieve', cont.retrieveContentData);

	// store data for user
	// app.post('/cont/storeGame', cont.storeGame);

	// user start game from where they left off
	// app.post('/cont/getGame', cont.getGame);
}