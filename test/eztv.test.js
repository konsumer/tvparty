if (!chai){ var chai = require('chai'); }
var should = chai.should();

eztv = require('../providers/eztv.js');


describe('Provider: EZTV', function(){
	it('should load correctly', function(){
		
		eztv.should.be.an('object');
	});

	it('should list shows', function(done){
		eztv.all.should.be.a('function');
		
		var show_count=0;
		eztv.all()
			.on('show', function(show){
				show_count++;
			})
			.on('end', function(){
				show_count.should.be.above(50);
				done();
			});
	});

	it('should list episodes', function(done){
		eztv.show.should.be.a('function');
		
		var episode_count=0;
		eztv.show('481/game-of-thrones')
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
		eztv.torrents.should.be.a('function');
		
		eztv.torrents('Game of Thrones S04E10 1080p HDTV x264-BATV')
			.on('torrent', function(torrent){
				torrents.push(torrent);
			})
			.on('end', function(){
				torrents.length.should.be.above(1);
				done();
			});

	});

	it('should find best torrent', function(){
		eztv.best.should.be.a('function');
		var best = eztv.best(torrents);
		best.magnet.should.ok();
	});
});
