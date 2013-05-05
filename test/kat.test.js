if (!chai){ var chai = require('chai'); }
var should = chai.should();


describe('Provider: Kat', function(){
	var kat;

	it('should load correctly', function(){
		kat = require('../providers/kat.js');
		kat.should.be.an('object');
	});

	it('should list shows', function(done){
		kat.all.should.be.a('function');
		
		var show_count=0;
		kat.all()
			.on('show', function(show){
				show_count++;
			})
			.on('end', function(){
				show_count.should.be.above(50);
				done();
			});
	});

	it('should list episodes', function(done){
		kat.show.should.be.a('function');
		
		var episode_count=0;
		kat.show('game-of-thrones-tv24493')
			.on('episode', function(episode){
				episode_count++;
			})
			.on('end', function(){
				episode_count.should.be.above(5); 
				done();
			});
	});

	var torrents = [];
	it('should list torrents', function(done){
		kat.torrents.should.be.a('function');
		
		kat.torrents('121148392')
			.on('torrent', function(torrent){
				torrents.push(torrent);
			})
			.on('end', function(){
				torrents.length.should.be.above(1);
				done();
			});

	});

	it('should find best torrent', function(){
		kat.best.should.be.a('function');
		var best = kat.best(torrents);
		// pretty fragile...
		best.magnet.should.equal('magnet:?xt=urn:btih:1b3513452662898320af82d65dc56df7966efd65&dn=game+of+thrones+s01e01+swesub+hdtv+xvid+b2b4u&tr=http%3A%2F%2Finferno.demonoid.me%3A3419%2Fannounce');
	});
});
