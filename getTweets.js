/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var db = require('mysql');

var twitter = require('twitter');

var emojiData = require('emoji-data');

var fs = require('fs');
var keyFile = process.argv[2];
var keys = [];
var client;
file = fs.readFileSync(keyFile,'utf8');
keys = file.split(',');

client = new twitter({
	consumer_key: keys[0],
	consumer_secret: keys[1],
	access_token_key: keys[2],
	access_token_secret: keys[3]
});



var connection = db.createConnection({
	host: "us-cdbr-iron-east-04.cleardb.net",
    user: "b523da0e107d81",
    password: "86c0e612",
    database: 'ad_107932f38ff9af6',
    encoding: 'utf8mb4'
});

connection.connect(function(err){
	if(err) {
		console.error('could not connect: ' + err.stack);
		return;
	}

	console.log('connected as ' + connection.threadId);
});

var count = 0;
var max = 20;
var tweets = [];
var stream = client.stream('statuses/sample',{language:'en'}, function(stream){
	stream.on('data', function(event) {
	  
	  if(count <= max && emojiData.scan(event.text) != '' && !event.text.includes("'")){
	  	//console.log();
	  	tweets.push(encodeURIComponent(event.text));
	  	//console.log(tweets);
		count++;
		if(count == max){
		  	var insertQuery = 'INSERT INTO tweets2 (text) VALUES ';
			for (var i = tweets.length - 1; i >= 0; i--) {
				insertQuery += '(\'' + tweets[i] + '\'),';
			}
			insertQuery = insertQuery.substring(0, insertQuery.length - 1) + ';';

			console.log(insertQuery);
			var query = connection.query(insertQuery,function(err,result){
				if(err) {connection.destroy(); throw err;}
				console.log(result.insertId);
				connection.destroy();
				
			});
		
	  	}
	  }

	});
	 
	stream.on('error', function(error) {
		connection.destroy();
	  throw error;
	});
});



/*
var query = connection.query('INSERT INTO scores SET ?', {name:'user1',score:'4'}, function(err, result){
	if(err){ throw err;}
	console.log(result.insertId);
});*/
