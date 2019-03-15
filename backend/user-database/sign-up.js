const MongoClient = require('mongodb').MongoClient;
const cred = require('./db_cred.js');
const bcrypt = require('bcrypt');

var userInfo = ['John', 'Doe', 'john.doe@email.com', 'john_doe', 'johnPassword'];

const saltRounds = 10;
var hashPass;
bcrypt.hash(userInfo[4], saltRounds, function(err,hash)
{
	hashPass = hash;
});

MongoClient.connect(cred.url, { useNewUrlParser: true }, function(err,db)
{
	if (err) throw err;
	var dbo = db.db("userDB");
	var myobj = {firstName: userInfo[0], lastName: userInfo[1], credentials: {emailAddress: userInfo[2], username: userInfo[3], password: hashPass}};
	dbo.collection("users").insertOne(myobj, function(err,res)
	{
		if (err) throw err;
		console.log('document inserted for: ' + userInfo[3]);
		db.close();
	});
});

