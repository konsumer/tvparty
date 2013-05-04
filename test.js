var kat=require('./providers/kat.js');


kat.all(function(show){
	console.log("SHOW", show);
});


/*
kat.show('game-of-thrones-tv24493', function(episode){
	console.log("EPISODE", episode);
});
*/

/*
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

*/