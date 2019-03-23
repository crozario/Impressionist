const mongoose = require('mongoose');
const schema = require('../models/cont.model.js');
// schema.Feat --> FeatureSchema
// schema.Cont --> ContentSchema

// verify that user-provided username is unique
exports.insertIntoContentDB = (req,res) => {
	// validate request
	if(!req.body.title || !req.body.length || !req.body.mediaFileLocation || !req.body.captionFile || !req.body.featureFileLocations || !req.body.emotionsList) {
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
		global.content = new schema.Cont({
			mediaType: 0,
			title: req.body.title,
			seasonNumber: req.body.seasonNumber,
			episodeNumber: req.body.episodeNumber,
			episodeTitle: req.body.episodeTitle,
			length: req.body.length,
			mediaFileLocation: req.body.mediaFileLocation,
			captionFile: req.body.captionFile,
			featureFileLocations: req.body.featureFileLocations,
			emotionsList: req.body.emotionsList
		});
	} else {
		global.content = new schema.Cont({
			mediaType: 1,
			title: req.body.title,
			length: req.body.length,
			mediaFileLocation: req.body.mediaFileLocation,
			captionFile: req.body.captionFile,
			featureFileLocations: req.body.featureFileLocations,
			emotionsList: req.body.emotionsList
		});
	}
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
};

exports.gamePlay = (req,res) => {
	// validate request
	console.log(req.body.contentID+ "   "+req.body.dialogueID);
	if(!req.body.contentID || !req.body.dialogueID) {
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
			return res.json({
				status: "success",
				featureURL: url
			});
		}
	}).catch(err => {
		console.log("this is where the error is coming from");
		return res.status(500).json({
			status: "failure",
			error: err.message || "error retrieving information from the database"
		});
	});
};