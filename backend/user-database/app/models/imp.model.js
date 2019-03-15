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

const HistorySchema = mongoose.Schema({
	mediaID: String,
	difficulty: String,
	completed: Boolean,
	activity: Array,
	score: Number,
	averageAccuracy: Number
}, {
	_id: false
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

CredentialsSchema.pre('save', async function(next) {
	try {
		const saltRounds = 10;
		const hashPass = await bcrypt.hash(this.password,saltRounds);
		this.password = hashPass;
		next();
	} catch(error) {
		next(error);
	}
});

module.exports = {
	Cred: mongoose.model('Cred', CredentialsSchema),
	Stat: mongoose.model('Stat', StatsSchema),
	Hist: mongoose.model('Hist', HistorySchema),
	User: mongoose.model('User', UserSchema)
}