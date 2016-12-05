/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var $ = require('jquery');

var db = require('mysql');

var twitter = require('twitter');

var emojiData = require('emoji-data');

process.env.TWITTER_KEY = 'r4GUQ7qbMYKKZJlo3MTw7QbyE';
process.env.TWITTER_SECRET = 'gAcNb592MTYKP2kwkKl60rbjfIvT7ENipiGQ14AZBK1MGzKLOa';
process.env.TWITTER_ACCESS_KEY = '805606589545742336-EZKbaIcBiAiKfXrJJ7R54J6lYHGSAwc';
process.env.TWITTER_ACCESS_SECRET = 'ZqS1z32o9It3gdilg4rIfiDNMqf7bXxNMTKtD9Ind1muJ';

var client = new twitter({
	consumer_key: process.env.TWITTER_KEY,
	consumer_secret: process.env.TWITTER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_SECRET
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
var max = 1;
var tweets = [];
var stream = client.stream('statuses/sample',{language:'en'}, function(stream){
	stream.on('data', function(event) {
	  
	  if(count <= max && emojiData.scan(event.text) != ''){
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
				if(err) {connection.end(); throw err;}
				console.log(result.insertId);
				connection.end();
				
			});
		
	  	}
	  }

	});
	 
	stream.on('error', function(error) {
		connection.end();
	  throw error;
	});
});



/*
var query = connection.query('INSERT INTO scores SET ?', {name:'user1',score:'4'}, function(err, result){
	if(err){ throw err;}
	console.log(result.insertId);
});*/
