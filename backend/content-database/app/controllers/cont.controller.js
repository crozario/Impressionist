const mongoose = require('mongoose');
const schema = require('../models/cont.model.js');
// schema.Cont --> ContentSchema

// verify that user-provided username is unique
exports.insertIntoContentDB = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.title || !info.length || !info.mediaFileLocation || !info.captions || !info.featureFileLocations || !info.emotionsList) {
		return res.status(400).json({
			status: "failure",
			error: "one of the required fields was not provided"
		});
	}
	// create a new content document
	// mediaType :
	// 		0  -->  tv show
	// 		1  -->  movie
	if(info.seasonNumber && info.episodeNumber &&info.episodeTitle) {
		// search the db to see if a document already exists for the same tv show/season/episode
		schema.Cont.findOne({'title': info.title, 'seasonNumber': info.seasonNumber, 'episodeNumber': info.episodeNumber})
		.then(result => {
			if(result) {
				// delete existing record --> the data from req will be saved in a new document in the db later
				schema.Cont.updateOne({'title': info.title, 'seasonNumber': info.seasonNumber, 'episodeNumber': info.episodeNumber}, {'episodeTitle': info.episodeTitle, 'length': info.length, 'mediaFileLocation': info.mediaFileLocation, 'captions': info.captions, 'featureFileLocations': info.featureFileLocations, 'emotionsList': info.emotionsList, 'netflixWatchID': info.netflixWatchID, 'netflixSubtitleOffset': info.netflixSubtitleOffset, 'characterNames': info.characterNames, 'characterDialogueIDs': info.characterDialogueIDs}, function(err) {
					if(err) {
						return res.status(500).json({
							status: "failure",
							error: err.message || "error occured when updating tv show document"
						});
					} else {
						return res.json({
							status: "success"
						});
					}
				});
			} else {
				global.content = new schema.Cont({
					mediaType: 0,
					title: info.title,
					seasonNumber: info.seasonNumber,
					episodeNumber: info.episodeNumber,
					episodeTitle: info.episodeTitle,
					length: info.length,
					mediaFileLocation: info.mediaFileLocation,
					captions: info.captions,
					featureFileLocations: info.featureFileLocations,
					emotionsList: info.emotionsList,
					netflixWatchID: info.netflixWatchID,
					netflixSubtitleOffset: info.netflixSubtitleOffset,
					characterNames: info.characterNames,
					characterDialogueIDs: info.characterDialogueIDs
				});
				// store content information in the database
				content.save()
				.then(data => {
					return res.json({
						status: "success"
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
				error: err.message || "error occured when searching for similar tv show document in db"
			});
		});
		
	} else {
		// search the db to see if a document already exists for the same movie
		schema.Cont.findOne({'title': info.title})
		.then(result => {
			if(result) {
				// delete existing record --> the data from req will be saved in a new document in the db later
				schema.Cont.updateOne({'title': info.title}, {'length': info.length, 'mediaFileLocation': info.mediaFileLocation, 'captions': info.captions, 'featureFileLocations': info.featureFileLocations, 'emotionsList': info.emotionsList, 'netflixWatchID': info.netflixWatchID, 'netflixSubtitleOffset': info.netflixSubtitleOffset, 'characterNames': info.characterNames, 'characterDialogueIDs': info.characterDialogueIDs}, function(err) {
					if(err) {
						return res.status(500).json({
							status: "failure",
							error: err.message || "error occured when updating movie document"
						});
					} else {
						return res.json({
							status: "success"
						});
					}
				});
			} else {
				global.content = new schema.Cont({
					mediaType: 1,
					title: info.title,
					length: info.length,
					mediaFileLocation: info.mediaFileLocation,
					captions: info.captions,
					featureFileLocations: info.featureFileLocations,
					emotionsList: info.emotionsList,
					netflixWatchID: info.netflixWatchID,
					netflixSubtitleOffset: info.netflixSubtitleOffset,
					characterNames: info.characterNames,
					characterDialogueIDs: info.characterDialogueIDs
				});
				content.save()
				.then(data => {
					return res.json({
						status: "success"
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
				error: err.message || "error occured when searching for similar tv show document in db"
			});
		});
	}
};

// retrieve content for game play
exports.gamePlay = (req,res) => {
	const info = req.body;
	// validate request
	if (!info.netflixWatchID || (info.dialogueID == null)) {
		return res.status(400).json({
			status: "failure",
			error: "netflixWatchID or dialogueID was not provided"
		});
	}
	// find media document associated with netflixWatchID and retrieve features file URL using dialogueID
	schema.Cont.findOne({"netflixWatchID":info.netflixWatchID})
	.then(result => {
		if(result) {
			var url = result.featureFileLocations[info.dialogueID];
			var emotion = result.emotionsList[info.dialogueID];
			var caption = result.captions[info.dialogueID];
			return res.json({
				status: "success",
				featureURL: url,
				dialogueEmotion: emotion,
				dialogueCaption: caption,
			});
		}
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error retrieving information from the database"
		});
	});
};

// retrieve all data from content document
exports.retrieveContentData = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.contentID) {
		return res.status(400).json({
			status: "failure",
			error: "contentID or dialogueID was not provided"
		});
	}
	schema.Cont.findById(mongoose.Types.ObjectId(info.contentID))
	.then(result => {
		if(result) {
			return res.json({
				status: "success",
				result: result
			});
		}
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error retrieving information from the database"
		});
	});
};

// retrieve all documents from content database
exports.retrieveAllContent = (req,res) => {
	schema.Cont.find({},'mediaType title seasonNumber episodeNumber episodeTitle length characterNames')
	.then(result => {
		return res.json({
			status: "success",
			result: result
		});
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error occured when retrieving information from the database"
		});
	});
};

// retrieve data to initialize game
exports.initializeGame = (req,res) => {
	const info = req.body;
	// validate request
	if(!info.netflixWatchID) {
		return res.status(400).json({
			status: "failure",
			error: "watchID was not provided"
		});
	}
	schema.Cont.findOne({'netflixWatchID': info.netflixWatchID }) //, {'characterNames':1, 'captions':1 , 'characterDialogueIDs':1})
	.then(data => {
		if(data==null) {
			// add new document to database that contains netflixWatchID, supported==false, missedCounter=0
			global.content = new schema.Cont({
				netflixWatchID: info.netflixWatchID,
				missedCounter: 0,
				supported: false
			});
			content.save()
			.then(data => {
				return res.json({
					supported: false
				});
			}).catch(err => {
				return res.status(500).json({
					status: "failure",
					error: err.message || "error storing data in the database"
				});
			});
		} else {
			if(data.supported == true) {
				// return data for supported content document
					return res.json({
						supported: data.supported,
						characterNames: data.characterNames,
						characterDialogueIDs: data.characterDialogueIDs,
						captions: data.captions
					});
			} else {
				// increment missedCounter for the document
				data.missedCounter = data.missedCounter + 1;
				data.save()
				.then(result => {
					return res.json({
						supported: false
					});
				}).catch(err => {
					return res.status(500).json({
						status: "failure",
						error: err.message || "error updating missedCounter"
					});
				});
			}
		}
	}).catch(err => {
		return res.status(500).json({
			error: err.message || "error retrieving information from the database"
		});
	})
};

// retrieve hot content; retrieve content that is not supported, but has been requested by users
exports.hotContent = (req,res) => {
	schema.Cont.find({'supported': false}, {'netflixWatchID':1, 'supported':1, 'missedCounter':1})
	.then(docs => {
		return res.json({
			status: "success",
			data: docs
		});
	}).catch(err => {
		return res.status(500).json({
			status: "failure",
			error: err.message || "error retrieving information from the database"
		});
	});
};

// store and retrieve file from database
// exports.storeRetrieve = (req,res) => {
// 	const info = req.body;
// 	console.log(info.file);
// 	schema.User.findOne({'credentials.username': info.username})
// 	.then(doc => {
// 		if(doc) {
// 			doc.featureFile = info.file;
// 			console.log(doc.featureFile);
// 			doc.save()
// 			.then(result => {
// 				schema.User.findOne({'credentials.username': info.username})
// 				.then(doc2 => {
// 					if(doc2) {
// 						return res.json({
// 							status: "success",
// 							file: doc2.featureFile
// 						});
// 					}
// 				}).catch(err => {
// 					return res.status(500).json({
// 						status: "failure",
// 						error: err.message || "error retrieving information from the database"
// 					});
// 				});
// 			}).catch(err => {
// 				return res.status(500).json({
// 					status: "failure",
// 					error: err.message || "error storing data into the database"
// 				});
// 			});
// 		}
// 	}).catch(err => {
// 		return res.status(500).json({
// 			status: "failure",
// 			error: err.message || "error retrieving information from the database"
// 		});
// 	});
// };