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

kat.torrents('213876875', function(torrents){
	console.log(torrents);
});