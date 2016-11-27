//defining a class called TweetGame that will allow a single object to perform all the necessary tasks
// "tweet" refers to the string retrieved from the twitter API
function TweetGame(tweet) {
	
	this.tweet = tweet;
	this.score = 0;
	this.options = [0,0,0,0,0];
	this.emoji = "";

	var utf = convertToUtf(this.tweet);
	var emo = isolateEmoji(utf);
	this.options = generateOptions(emo);
	this.emoji = translateEmoji(emo);
	this.options[0] = this.emoji;
	positions = findEmojis(utf, emo);
	this.tweetWithBlanks = rebuildStringWithBlanks(utf, emo, positions);
}

TweetGame.prototype.changeScore = function( magnitude) {
	return this.score += magnitude;
};

// using the parameter "emoji" a similar emoji is generated by decreasing the unicode representation
// if the options reach the lower boundary then emoji are selected above the original value
// returns 0 in options[0] if somehow the emoji codes exit the acceptable range
function generateOptions(emoji) {
	var first = "";
	var second = "";
	var options = [];
	var randomCode = 0;
	for(var j = 0; j < 12; j++) {
		if(j < 6) {
		first += emoji[j];
		}
		else {
			second += emoji[j];
		}
	}
	options[0] = emoji;
	var lowerLimit = 56831;
	var upperLimit = 56911;
	var newCode = utfToUnicode(second);
	var original = newCode;
	for(var i = 1; i < 5; ++i) {
		options[i] = String.fromCharCode(utfToUnicode(first));
		if(newCode > lowerLimit) {
			--newCode;
			options[i] += String.fromCharCode(newCode);
		}
		else if(newCode === lowerLimit) {
			newCode = original + 1;
			options[i] += String.fromCharCode(newCode);
		}
		else if (newCode < upperLimit) {
			
			options[i] += String.fromCharCode(newCode);
		}
		else {
			options [0] = 0;
			return options;
		}
	}
	return options;
}

//this function takes in utf-16 encoding and returns the string representation of an emoji
function translateEmoji(utf) {
	var first = "";
	var second = "";
	var str = "";
	for(var j = 0; j < 12; j++) {
		if(j < 6) {
		first += utf[j];
		}
		else {
			second += utf[j];
		}
	}
	str += String.fromCharCode(utfToUnicode(first));
	str += String.fromCharCode(utfToUnicode(second));
	return str;
}

// this function finds all occurences of the chosen emoji and returns their positions
function findEmojis(utf, emo) {
	var positions = [];
	for(var i = 0; i < utf.length -1; i++) {
		if(utf[i] === emo) {
			positions.push(i);
		}
	}	
	return positions;
}

// this function replaces all occurences of the given emoji in the given tweet with spaces. 
// It the returns the generated string with blanks
function rebuildStringWithBlanks(utf, emoji, positions) {
	var counter = 0;
	var str = "";
	for(var i = 0; i < utf.length; ++i) {
		if(i === positions[counter]) {
			++counter;
			str += "__";
			continue;
		}
		else if (utf[i].length > 6) {
			str += translateEmoji(utf[i]);
		}
		else {
			str += String.fromCharCode(utfToUnicode(utf[i]));
		}
	}
	return str;
}

// this functions takes a utf-16 encoded number and turns it back into unicode.
function utfToUnicode(utfString) {
	var hex = "";
	for(var i = 2; i < 6; i++) {
		hex += utfString[i];
	}
	return parseInt(hex, 16);
}

// converts the given string into its corresponding unicode
function convertToUtf(str) {
	var resUtf = [];
	var realLength = 0;
	var temp = "";
	var c = 1;
	flag = 1;
	for(var i = 0; i < str.length; i++) {
		//stores each unicode into an array
		temp = ("\\u" + ("000" + str[i].charCodeAt(0).toString(16)).substr(-4));
		
		//String.fromCharCode(str[i].charCodeAt(0))
		if( flag && temp > "\\ud83c" && i !== 0 && resUtf[i-c] > "\\ud83c") {
			resUtf[i-c] += temp; 
			c++;
			flag = 0;
			continue;
		}
		else {
			resUtf.push(temp);
			flag = 1;
		}
	}
	return resUtf;
}

// this method isolates the last occurring emoji in a given utf-16 sequence
// return value is the utf-16 translation of the unicode for the emoji
function isolateEmoji(unicode) {
	var chosen = "";
	var lowerLimit = "\\ude00";
	var upperLimit = "\\ude4f";
	for(var i = unicode.length - 1; i >= 0; i-- ) {
			if(unicode[i].length > 6 && chosen === "") {
				if(i === unicode.length) {
					continue;
				}
				if(i > 0 && unicode[i-1] === "\\u200d" ||
				  i < unicode.length -1 && unicode[i+1] === "\\u200d") {
					continue;
				}
				else {
					chosen = unicode[i];
				}
			}
	}
	return chosen;
}

function test() {
	var game = new TweetGame("yo🤐🤐 y😴o y🤐yo😂👨‍👩‍👧‍👦");
	game.changeScore(5);
	console.log(game.score);
	console.log(game.tweetWithBlanks);
	console.log(game.emoji);
	console.log(game.options);
}
test();