const mongoose = require('mongoose');
const schema = require('../models/cont.model.js');
// schema.Cont --> ContentSchema

// verify that user-provided username is unique
exports.insertIntoContentDB = (req,res) => {
	// validate request
	if(!req.body.title || !req.body.length || !req.body.mediaFileLocation || !req.body.captions || !req.body.featureFileLocations || !req.body.emotionsList) {
		return res.status(400).json({
			status: "failure",
			error: "one of the required fields was not provided"
		});
	}
	// create a new content document
	// mediaType :
	// 		0  -->  tv show
	// 		1  -->  movie
	if(req.body.seasonNumber && req.body.episodeNumber &&req.body.episodeTitle) {
		// search the db to see if a document already exists for the same tv show/season/episode
		schema.Cont.findOne({'title': req.body.title, 'seasonNumber': req.body.seasonNumber, 'episodeNumber': req.body.episodeNumber})
		.then(result => {
			if(result) {
				// delete existing record --> the data from req will be saved in a new document in the db later
				schema.Cont.updateOne({'title': req.body.title, 'seasonNumber': req.body.seasonNumber, 'episodeNumber': req.body.episodeNumber}, {'episodeTitle': req.body.episodeTitle, 'length': req.body.length, 'mediaFileLocation': req.body.mediaFileLocation, 'captions': req.body.captions, 'featureFileLocations': req.body.featureFileLocations, 'emotionsList': req.body.emotionsList, 'netflixSubtitleOffset': req.body.netflixSubtitleOffset, 'characterNames': req.body.characterNames, 'characterDialogueIDs': req.body.characterDialogueIDs}, function(err) {
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
					title: req.body.title,
					seasonNumber: req.body.seasonNumber,
					episodeNumber: req.body.episodeNumber,
					episodeTitle: req.body.episodeTitle,
					length: req.body.length,
					mediaFileLocation: req.body.mediaFileLocation,
					captions: req.body.captions,
					featureFileLocations: req.body.featureFileLocations,
					emotionsList: req.body.emotionsList,
					netflixSubtitleOffset: req.body.netflixSubtitleOffset,
					characterNames: req.body.characterNames,
					characterDialogueIDs: req.body.characterDialogueIDs
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
						error: err.message || "error occured while storing infromation in the database"
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
		schema.Cont.findOne({'title': req.body.title})
		.then(result => {
			if(result) {
				// delete existing record --> the data from req will be saved in a new document in the db later
				schema.Cont.updateOne({'title': req.body.title}, {'length': req.body.length, 'mediaFileLocation': req.body.mediaFileLocation, 'captions': req.body.captions, 'featureFileLocations': req.body.featureFileLocations, 'emotionsList': req.body.emotionsList, 'netflixSubtitleOffset': req.body.netflixSubtitleOffset, 'characterNames': req.body.characterNames, 'characterDialogueIDs': req.body.characterDialogueIDs}, function(err) {
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
					title: req.body.title,
					length: req.body.length,
					mediaFileLocation: req.body.mediaFileLocation,
					captions: req.body.captions,
					featureFileLocations: req.body.featureFileLocations,
					emotionsList: req.body.emotionsList,
					netflixSubtitleOffset: req.body.netflixSubtitleOffset,
					characterNames: req.body.characterNames,
					characterDialogueIDs: req.body.characterDialogueIDs
				});
				content.save()
				.then(data => {
					return res.json({
						status: "success"
					});
				}).catch(err => {
					return res.status(500).json({
						status: "failure",
						error: err.message || "error occured while storing infromation in the database"
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
	// validate request
	if(!req.body.contentID) {
		return res.status(400).json({
			status: "failure",
			error: "contentID or dialogueID was not provided"
		});
	}
	// find media document associated with contentID and retrieve features file URL using dialogueID
	schema.Cont.findById(mongoose.Types.ObjectId(req.body.contentID))
	.then(result => {
		if(result) {
			var url = result.featureFileLocations[req.body.dialogueID];
			var emotion = result.emotionsList[req.body.dialogueID];
			var captions = result.captions[req.body.dialogueID];
			return res.json({
				status: "success",
				featureURL: url,
				dialogueEmotion: emotion,
				captions: captions,
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
	// validate request
	if(!req.body.contentID) {
		return res.status(400).json({
			status: "failure",
			error: "contentID or dialogueID was not provided"
		});
	}
	schema.Cont.findById(mongoose.Types.ObjectId(req.body.contentID))
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