/*

Data-provider for eztv torrents

 */

var moment = require('moment'),
	events = require('events'),
	get = require('../get.js');

// TODO: get better episode info from elsewhere & cache data more

/**
 * Get list of shows
*/
exports.all = function(){
	var emitter = new events.EventEmitter();
	get('https://eztv.ch/showlist/', function($){
		var links = $('a.thread_link');
		links.each(function(i,el){
			var show = {
				id: $(el).attr('href').replace(/\/shows\/([0-9]+)\/(.+)\//, '$1/$2'),
				name: $(el).text(),
				url:  'https://eztv.ch/' + $(el).attr('href'),
				source: 'eztv'
			};
			emitter.emit('show', show);
			if (i == links.length-1){
				emitter.emit('end');
			}
		});
	});
	return emitter;
};

/**
 * Get episode listings for a single show
 * 
 * @param  {String}   id       The ID from list()
 * @param  {Boolean}  torrents Grab torrents?
 */
exports.show = function(id, torrents){
	var emitter = new events.EventEmitter();
	get('https://eztv.ch/shows/' + id, function($){
		var links = $('.forum_thread_post:nth-child(2) a');
		links.each(function(i,el){
			var episode = {
				id: $(el).text(),
				date: undefined,
				name: $(el).text(),
				show: id,
				image: $('.show_info_main_logo img').attr('src'),
				has_torrents: true
			};
			// TODO: check these against every show
			var re = /s([0-9]+)e([0-9]+)|([0-9]+)x([0-9]+)/gmi;
			var m = re.exec($(el).text());
			if(m){
				episode.season = parseInt(m[1], 10);
				episode.episode = parseInt(m[2], 10);
				if (torrents){
					episode.magnet = $(el.parentElement.parentElement).find('[title="Magnet Link"]').attr('href');
					episode.torrent = $(el.parentElement.parentElement).find('[title="Download Mirror #1"]').attr('href');
				}
				emitter.emit('episode', episode);
			}
			if (i == links.length-1){
				emitter.emit('end');
			}
		});
	});
	return emitter;
};

/**
 * Get list of torrents for an episode
 * 
 * @param  {String}   id       The ID from show()
 */
exports.torrents = function(id){
	var emitter = exports.show(id,true);
	emitter.on('episode', function(show){
		console.log(show.id);
		if (show.id === id){
			emitter.emit('torrent', {
				name: show.name,
				link: show.torrent,
				magnet: show.magnet,
				size: undefined,
				seed: undefined,
			});
		}
	});
	return emitter;
};

/**
 * Find "best" torrent, from a list of available torrents for a show
 *
 * Criteria for "best" is only torrent
 * 
 * @param   {Array}   torrents list of torrents available for a show
 * @returns {Object}  the "best" torrent
 */
exports.best = function(torrents){
	return torrents[0];
};