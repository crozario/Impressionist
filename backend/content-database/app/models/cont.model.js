const mongoose = require('mongoose');

const ContentSchema = mongoose.Schema({
	mediaType: Number,
	title: String,
	seasonNumber: Number,
	episodeNumber: Number,
	episodeTitle: String,
	length: Number, // store length of movie/tv show in seconds
	mediaFileLocation: String,
	captionFile: String,
	featureFileLocations: Array,
	emotionsList: Array // ,
	// netflixTitleID: String,
	// netflixWatchID: String,
	// netflixMediaURL: String
}, {
	collection: 'content'
});

module.exports = {
	Cont: mongoose.model('Cont', ContentSchema)
}