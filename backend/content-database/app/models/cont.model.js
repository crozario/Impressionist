const mongoose = require('mongoose');

const ContentSchema = mongoose.Schema({
	mediaType: Number,
	title: String,
	seasonNumber: Number,
	episodeNumber: Number,
	episodeTitle: String,
	length: Number, // store length of movie/tv show in seconds
	mediaFileLocation: String,
	captions: {type: [Array], default: undefined},
	featureFileLocations: Array,
	featureFile: {binData: Buffer},
	emotionsList: Array,
	netflixTitleID: String,
	netflixWatchID: String,
	netflixMediaURL: String,
	netflixSubtitleOffset: Number,
	characterNames: Array,
	characterDialogueIDs: Map,
	missedCounter: Number,
	supported: Boolean
}, {
	collection: 'content'
});

module.exports = {
	Cont: mongoose.model('Cont', ContentSchema)
}