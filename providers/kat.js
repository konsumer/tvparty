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
				console.log(buffer+"");
				callback(require('cheerio').load(buffer, {ignoreWhitespace: true}));
			});
	});
};

/**
 * Get list of shows
 * 
 * @param  {Function} callback called on a show
*/
exports.all = function(callback){
	callback = callback || function(show){};
	get('http://kat.ph/tv/show/', function($){
		$('ul.textcontent a.plain').each(function(i, el){
			var show = {
				id: $(el).attr('href').replace(/\//g,''),
				name: $(el).text(),
				url:  'http://kat.ph' + $(el).attr('href'),
				source: 'kat'
			};
			callback(show);
		});
	});
};

/**
 * Get episode listings for a single show
 * 
 * @param  {String}   id       The ID from list()
 * @param  {Function} callback called on all episodes for this show
 */
exports.show = function(id, callback){
	get('http://kat.ph/' + id + '/', function($){
		$('a.infoListCut').each(function(i, el){
			var episode = {
				date: moment($(el).find('.versionsEpDate').text().replace(/ +/g,' '), 'dddd, MMMM D YYYY').utc().unix(),
				number: parseInt($(el).find('.versionsEpNo').text().match(/\d+/)[0], 10),
				name: $(el).find('.versionsEpName').text()
			};
			if ($(el).attr('onclick')){
				episode.id = $(el).attr('onclick').match(/\d+/)[0];
				episode.has_torrents = true;
			}else{
				episode.has_torrents = false;
			}
			callback(episode);
		});
	});
};

/**
 * Get list of torrents for an episode
 * 
 * @param  {String}   id       The ID from show()
 * @param  {Function} callback called on lll torrents for this show
 */
exports.torrents = function(id, callback){
	get('http://kat.ph/media/getepisode/' + id + '/', function($){
		$('tr.odd, tr.even').each(function(i, el){
			var torrent = {
				name: $('.torrentname .font12px', $(el)).text(),
				link: 'http://kat.ph' + $('.torrentname .font12px', $(el)).attr('href'),
				magnet: $('a.imagnet', $(el)).attr('href'),
				size: $('td.center', $(el)).slice(0,1).text(),
				seed: $('td.center', $(el)).slice(3,4).text(),
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

			callback(torrent);
		});
	});
};

/**
 * Find "best" torrent, from a list of available torrents for a show
 *
 * Criteria for "best" is smallest file w/ seeds
 * 
 * @param  {[type]}   torrents list of torrents available for a show
 * @param  {Function} callback called with torrent object that is "best"
 */
exports.best = function(torrents, callback){
	torrents.sort(function(a,b){
		return a.size - b.size;
	});
	for (i in torrents){
		if (torrents[i].seed > 0){
			callback(torrents[i]);
			break;
		}
	}
}

