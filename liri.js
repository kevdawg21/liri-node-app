var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var cmdArgs = process.argv;
var command = process.argv[2];

if (cmdArgs.length > 3) {
	var target = process.argv[3];
} else if (cmdArgs.length === 3) {
	var target = '';
}


var error;
var errorInfo = 'Error: ' + error + '\n';

function getTweets() {
	fs.appendFile('./log.txt', 'Command: node liri.js my-tweets ' + '\n');
	var tweety = new Twitter(twitterKeys);
	var params = {screen_name: 'program1218', count: 20};
	tweety.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			fs.appendFile('./log.txt', errorInfo);
			console.log(errorInfo);
		} else {
			var outputStr = '\nUser Tweets:\n\n' 
			for (var i = 0; i < tweets.length; i++) {
				outputStr += tweets[i].created_at + '\n' + tweets[i].text + '\n\n';
			}
			fs.appendFile('./log.txt', 'getTweets = ' + outputStr + '\n');
			console.log(outputStr);
		}
	});
}

function spotSong(song) {
	fs.appendFile('./log.txt', 'Command: node liri.js spotify-this-song ' + '\n');
	var search;
	if (!song) {
		search = 'The Sign Ace Of Base';
	} else {
		search = song;
	}
	var spotify = new Spotify({
	  id: '1765f7e987df4c218cb3a6fd046c07c2',
	  secret: 'e074ce4cbeda4ef388a140a3940b9597'
	});
	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			fs.appendFile('./log.txt', errorInfo);
			console.log(errorInfo);
		} else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: no song found';
				fs.appendFile('./log.txt', errorStr2, function(err) {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
				var outputStr = 'Song Name: ' + songInfo.name + '\n'+ 
								'Artist: ' + songInfo.artists[0].name + '\n' + 
								'Album: ' + songInfo.album.name + '\n' + 
								'Preview Here: ' + songInfo.preview_url + '\n';
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n');
				console.log(outputStr);
			}
	    }
	});
}

function movieThis(movie) {
	fs.appendFile('./log.txt', 'Command: node liri.js movie-this ' + movie + '\n');
	var search;
	if (!movie) {
		search = 'mr.nobody';
	} else {
		search = movie;
	}
	var queryStr = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + search + '&plot=full&tomatoes=true';
	request(queryStr, function (error, response, body) {
		if (error) {
			var errorStr1 = 'ERROR: ' + error;
			fs.appendFile('./log.txt', errorStr1, function(err) {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released) {
				var errorStr2 = 'ERROR: no movie found';
				fs.appendFile('./log.txt', errorStr2);
				console.log(errorStr2);
			} else {
		    	var outputStr = 'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n' + 
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n');
				console.log(outputStr);
			}
		}
	});
}

function doWhatItSays() {
	fs.appendFile('./log.txt', 'Command: node liri.js do-what-it-says\n');
	fs.readFile('./random.txt', 'utf8', function(error, data) {
		if (error) {
			console.log('ERROR: ' + error);
		} else {
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();
			if (command === 'my-tweets') {
				getTweets(); 
			} else if (command === 'spotify-this-song') {
					spotSong(param);
			} else if (command === 'movie-this') {
					movieThis(param);
			}
		}
	});
}

if (command === 'my-tweets') {
	getTweets(); 

} else if (command === `spotify-this-song`) {
	spotSong(target);

} else if (command === `movie-this`) {
	movieThis(target);

} else if (command ===  `do-what-it-says`) {
	doWhatItSays();

} else {
	console.log('\nValid commands include:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says');
}