var kat=require('./providers/kat.js');

/*
count=0;
kat.all()
	.on('show', function(show){
		console.log('SHOW', show);
		count++;
	})
	.on('end', function(){
		console.log('got ' + count + ' shows');
	});

count=0;
kat.show('game-of-thrones-tv24493')
	.on('episode', function(episode){
		console.log('EPISODE', episode);
		count++;
	})
	.on('end', function(){
		console.log('got ' + count + ' episodes');
	});

*/

var torrents = [];
kat.torrents('121148392')
	.on('torrent', function(torrent){
		console.log('TORRENT', torrent);
		torrents.push(torrent);
	})
	.on('end', function(){
		console.log('\nBEST', kat.best(torrents));
	});