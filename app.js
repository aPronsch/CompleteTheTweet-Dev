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

var $ = require('jquery');

var db = require('mysql')

var connection = db.createConnection({
	host: "us-cdbr-iron-east-04.cleardb.net",
    user: "b523da0e107d81",
    password: "86c0e612",
    database: 'ad_107932f38ff9af6'
});

connection.connect(function(err){
	if(err) {
		console.error('could not connect: ' + error.stack);
		return;
	}

	console.log('connected as ' + connection.threadId);
});

/*
var query = connection.query('INSERT INTO scores SET ?', {name:'user1',score:'4'}, function(err, result){
	if(err){ throw err;}
	console.log(result.insertId);
});*/

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/html'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

connection.end();
