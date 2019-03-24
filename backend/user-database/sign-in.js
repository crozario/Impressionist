const MongoClient = require('mongodb').MongoClient;
const cred = require('./db_cred.js');
const bcrypt = require('bcrypt');

var creds = ["jane_doe", "hello"]; //returns true
//var creds = ["jane_doe", "hellothere"]; //returns false

MongoClient.connect(cred.url, { useNewUrlParser: true }, function(err, db)
{
	if (err) throw err;
	var dbo = db.db("userDB");
	var dbpass;
	dbo.collection("users").find({'credentials.username': creds[0]}, {projection: {_id: 0, 'credentials.password':1} }).toArray(function(err,result)
		{
			if (err) throw err;
			console.log(result[0]["credentials"]["password"]);
			dbpass=result[0]["credentials"]["password"];
			db.close()

			var valid;
			bcrypt.compare(creds[1],dbpass,function(err,res)
			{
				if (err) throw err;
				console.log(res);
			});
		});	
});


