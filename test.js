var kat=require('./providers/kat.js');

/*
kat.all()
	.on('show', function(show){
		console.log(show);
	})
	.on('end', function(){
		console.log('got shows');
	});
*/

kat.show('game-of-thrones-tv24493')
	.on('episode', function(episode){
		console.log(episode);
	})
	.on('end', function(){
		console.log('got episodes');
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