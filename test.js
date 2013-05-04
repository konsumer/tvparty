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

var torrents = [];
kat.torrents('266404348', function(torrent){
	console.log(torrent);
	torrents.push(torrent);
});

process.on('exit', function(){
	kat.best(torrents, function(best){
		console.log('BEST', best);
	});
});