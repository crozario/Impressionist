const mongoose = require('mongoose');

const FeatureSchema = mongoose.Schema({
	numOfDialogues: Number,
	featureFileLocations: Array
}, {
	_id: false
});

const ContentSchema = mongoose.Schema({
	mediaType: String,
	title: String,
	season: Number,
	episode: Number,
	length: Number, // store length of movie/tv show in minutes
	mediaFileLocation: String,
	captionFile: String,
	featureFiles: FeatureSchema
}, {
	collection: 'content'
});

module.exports = {
	Feat: mongoose.model('Feat', FeatureSchema),
	Cont: mongoose.model('Cont', ContentSchema)
}