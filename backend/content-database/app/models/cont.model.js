const mongoose = require('mongoose');

const ContentSchema = mongoose.Schema({
	mediaType: String,
	title: String,
	season: Number,
	episode: Number,
	episodeTitle: String,
	length: Number, // store length of movie/tv show in minutes
	mediaFileLocation: String,
	captionFile: String,
	featureFiles: Array,
	emotionsList: Array
}, {
	collection: 'content'
});

module.exports = {
	Cont: mongoose.model('Cont', ContentSchema)
}