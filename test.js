var kat=require('./providers/kat.js');

/*
kat.all(function(shows){
	console.log(shows);
});
*/

/*
kat.show('game-of-thrones-tv24493', function(episodes){
	console.log(episodes);
});
*/

kat.torrents('266404348', function(torrents){
	console.log(torrents);
}, true);