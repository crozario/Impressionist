module.exports = (app) => {
	const cont = require('../controllers/cont.controller.js');

	// adding to content database
	app.post('/cont', cont.insertIntoContentDB);

	// retrieve content for game play
	app.post('/cont/play', cont.gamePlay);

	// retrieve all data from content document
	app.post('/cont/retrieveDoc', cont.retrieveContentData);

	// retrieve all documents from content database
	app.post('/cont/retrieveAll', cont.retrieveAllContent);

	// retrieve data to initialize game
	app.post('/cont/initializeGame', cont.initializeGame);

	// store and retrieve file from database
	// app.post('/cont/storeRetrieve', cont.storeRetrieve);

	// store data for user
	// app.post('/cont/storeGame', cont.storeGame);

	// user start game from where they left off
	// app.post('/cont/getGame', cont.getGame);
}