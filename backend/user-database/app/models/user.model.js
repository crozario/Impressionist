const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CredentialsSchema = mongoose.Schema({
	emailAddress: String,
	username: String,
	password: String //,
	// OAuth: Boolean
}, {
	_id: false
});

const StatsSchema = mongoose.Schema({
	highScore: Number,
	rank: Number
}, {
	_id: false
});

const ScoreSchema = mongoose.Schema({
	scores: {type: Map, default: {}},
	dialogueIDs: Array
}, {
	_id: false
});

const HistorySchema = mongoose.Schema({
	netflixWatchID: String, 
	completed: Boolean,
	activity: Array,
	scores: ScoreSchema,
	totalScore: Number
});

const UserSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	credentials: CredentialsSchema,
	gameStats: StatsSchema,
	lastLogin: String,
	gameHistory: {type: [HistorySchema], default: undefined}
}, {
	collection: 'users'
});

const salt = 10;
CredentialsSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.hash(user.password,salt, function(err,hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

module.exports = {
	Cred: mongoose.model('Cred', CredentialsSchema),
	Stat: mongoose.model('Stat', StatsSchema),
	Score: mongoose.model('Score', ScoreSchema),
	Hist: mongoose.model('Hist', HistorySchema),
	User: mongoose.model('User', UserSchema)
}