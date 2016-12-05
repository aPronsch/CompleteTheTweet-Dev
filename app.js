/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var db = require('mysql')

var connection = db.createConnection({
	host: "us-cdbr-iron-east-04.cleardb.net",
    user: "b523da0e107d81",
    password: "86c0e612",
    database: 'ad_107932f38ff9af6',
    encoding: 'utf8mb4',
    connectionTimeout:'5000'
});

	
connection.connect(function(err){
	if(err) {
		console.error('could not connect: ' + err.stack);
		return;
	}	
	console.log('connected as ' + connection.threadId);
});
	


var tweets = [];

connection.query('SELECT text FROM tweets2',function(err,rows, fields){
	if(err) throw err;
	for (var i = 0; i < rows.length; i++) {
		try{
			var tweet = decodeURIComponent(rows[i].text);
			tweets.push(tweet);
		} catch(ReferenceError) {
			console.log(i);
		}
		
	}
	connection.destroy();
	//console.log(tweets);		
});

//connection.end();

/*
var query = connection.query('INSERT INTO scores SET ?', {name:'user1',score:'4'}, function(err, result){
	if(err){ throw err;}
	console.log(result.insertId);
});*/

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/html'));



app.get('/requestTweet',function(req,res){
	console.log(tweets.length);
	var ind = Math.floor(Math.random() * tweets.length);
	console.log(ind);
	var toSend = tweets[ind];
	console.log(toSend);
	res.send(toSend);
	connection.destroy();
	
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});



