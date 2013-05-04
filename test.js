var kat=require('./providers/kat.js');

var show_count=0;
kat.all()
	.on('show', function(show){
		console.log('SHOW', show);
		show_count++;
	})
	.on('end', function(){
		console.log('got ' + show_count + ' shows');
	});

var episode_count=0;
kat.show('game-of-thrones-tv24493')
	.on('episode', function(episode){
		console.log('EPISODE', episode);
		episode_count++;
	})
	.on('end', function(){
		console.log('got ' + episode_count + ' episodes');
	});

var torrents = [];
kat.torrents('121148392')
	.on('torrent', function(torrent){
		console.log('TORRENT', torrent);
		torrents.push(torrent);
	})
	.on('end', function(){
		console.log('\nBEST', kat.best(torrents));
	});