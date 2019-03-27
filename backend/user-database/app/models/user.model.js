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
	score: Array,
	dialogueID: Array
}, {
	_id: false
});

const HistorySchema = mongoose.Schema({
	netflixWatchID: String, 
	completed: Boolean,
	activity: Array,
	score: {type: [ScoreSchema], default: undefined}
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

// CredentialsSchema.pre('save', async function(next) {
// 	try {
// 		if(this.isDirectModified) {
// 			const salt = 10;
// 			const hash_pass = await bcrypt.hash(this.password,salt);
// 			this.password = hash_pass;
// 			console.log(this.password);
// 			next();
// 		}
// 	} catch(err) {
// 		next(err);
// 	}
// });

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