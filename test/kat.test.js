if (!chai){ var chai = require('chai'); }
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should();


var kat = require('../providers/kat.js');

describe('Kat Provider Plugin', function(){	
	it('should list shows', function(done){
		kat.all.should.be.a('function');
		var show_count=0;
		kat.all()
			.on('show', function(show){
				show_count++;
			})
			.on('end', function(){
				// maybe a bit fragile. should design a better test
				show_count.should.equal(7174); 
				done();
			});
	});

	it('should list episodes', function(done){
		kat.show.should.be.a('function');
		var episode_count=0;
		kat.show('game-of-thrones-tv24493')
			.on('episode', function(episode){
				console.log('EPISODE', episode);
				episode_count++;
			})
			.on('end', function(){
				console.log('got ' + episode_count + ' episodes');
				done();
			});
	});

	it('should list torrents', function(){
		kat.torrents.should.be.a('function');
	});

	it('should find best torrent', function(){
		kat.best.should.be.a('function');
	});
});


/*

var torrents = [];
kat.torrents('121148392')
	.on('torrent', function(torrent){
		console.log('TORRENT', torrent);
		torrents.push(torrent);
	})
	.on('end', function(){
		console.log('\nBEST', kat.best(torrents));
	});
*/