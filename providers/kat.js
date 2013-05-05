/*

Data-provider for kat.ph tv torrents

 */

var moment = require('moment'),
	events = require('events');

/**
 * Shortcut for zlib GET + cheerio-parse
 * 
 * @param  {String}   u        Full URL
 * @param  {Function} callback called with cheerio pseudo-jquery object for page
 */
var get = function(u, callback){
	require('http').get(require('url').parse(u), function(res){
		var chunks = [];
		res.pipe(require('zlib').createGunzip())
			.on('data', function (data) { chunks.push(data); })
			.on('end', function(){
				var buffer = Buffer.concat(chunks);
				callback(require('cheerio').load(buffer, {ignoreWhitespace: true}));
			});
	});
};

/**
 * Get list of shows
 * 
 * @param  {Function} callback called on a show
*/
exports.all = function(){
	var emitter = new events.EventEmitter();
	get('http://kat.ph/tv/show/', function($){
		var links = $('ul.textcontent a.plain');
		links.each(function(i, el){
			var show = {
				id: decodeURIComponent($(el).attr('href').replace(/\//g,'')),
				name: $(el).text(),
				url:  'http://kat.ph' + $(el).attr('href'),
				img: 'http://yuq.me/tv/' + show.id.match(/tv([0-9]+)/)[0] + '.png',
				source: 'kat'
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
 * @param  {Function} callback called on all episodes for this show
 */
exports.show = function(id){
	var emitter = new events.EventEmitter();
	get('http://kat.ph/' + id + '/', function($){
		var links = $('a.infoListCut');
		links.each(function(i, el){
			var episode = {
				date: moment($(el).find('.versionsEpDate').text().replace(/ +/g,' '), 'dddd, MMMM D YYYY').utc().unix(),
				number: parseInt($(el).find('.versionsEpNo').text().match(/\d+/)[0], 10),
				name: $(el).find('.versionsEpName').text(),
				show: id
			};
			// TODO: get season #
			if ($(el).attr('onclick')){
				episode.id = decodeURIComponent($(el).attr('onclick').match(/\d+/)[0]);
				episode.has_torrents = true;
			}else{
				episode.has_torrents = false;
			}
			emitter.emit('episode', episode);
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
	var emitter = new events.EventEmitter();
	get('http://kat.ph/media/getepisode/' + id + '/', function($){
		var rows = $('tr.odd, tr.even');
		rows.each(function(i, el){
			var torrent = {
				name: $(el).find('.torrentname .font12px').text(),
				link: 'http://kat.ph' + $(el).find('.torrentname .font12px').attr('href'),
				magnet: $(el).find('a.imagnet').attr('href'),
				size: $(el).find('td.center').eq(0).text(),
				seed: $(el).find('td.center').eq(1).text(),
			};

			// normalize
			var num = parseFloat(torrent.size);
			if (torrent.size.indexOf('TB') !== -1){
				torrent.size = num * 1024 * 1024 * 1024 * 1024;
			}else if (torrent.size.indexOf('GB') !== -1){
				torrent.size = num * 1024 * 1024 * 1024;
			}else if (torrent.size.indexOf('MB') !== -1){
				torrent.size = num * 1024 * 1024;
			}else if (torrent.size.indexOf('KB') !== -1){
				torrent.size = num * 1024;
			}else{
				torrent.size = num;
			}
			torrent.seed = parseInt(torrent.seed, 10);

			emitter.emit('torrent', torrent);
			if (i == rows.length-1){
				emitter.emit('end');
			}
		});
	});
	return emitter;
};

/**
 * Find "best" torrent, from a list of available torrents for a show
 *
 * Criteria for "best" is smallest file w/ seeds
 * 
 * @param   {Array}   torrents list of torrents available for a show
 * @returns {Object}  the "best" torrent
 */
exports.best = function(torrents){
	torrents.sort(function(a,b){
		return a.size - b.size;
	});
	for (i in torrents){
		if (torrents[i].seed > 0){
			return torrents[i];
		}
	}
}

