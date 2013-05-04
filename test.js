var kat=require('./providers/kat.js');

/*
kat.all()
	.on('show', function(show){
		console.log('SHOW', show);
	})
	.on('end', function(){
		console.log('got shows');
	});


kat.show('game-of-thrones-tv24493')
	.on('episode', function(episode){
		console.log('EPISODE', episode);
	})
	.on('end', function(){
		console.log('got episodes');
	});

*/

var torrents = [];
kat.torrents()
	.on('torrent', function(torrent){
		console.log('TORRENT', torrent);
		torrents.push(torrent);
	})
	.on('end', function(){
		console.log('BEST', kat.best(torrents));
	});