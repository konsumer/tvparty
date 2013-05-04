var kat=require('./providers/kat.js');

kat.list(function(shows){
	console.log(shows);
});

kat.get('game-of-thrones-tv24493', function(episodes){
	console.log(episodes);
});