/*

Data-provider for kat.ph tv torrents

 */

var moment = require('moment');

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
 * @param  {Function} callback (shows) - shows is array of info
*/
exports.all = function(callback){
	callback = callback || function(shows){};
	get('http://kat.ph/tv/show/', function($){
		var shows=[];
		$('ul.textcontent a.plain').each(function(i, el){
			var show = {
				id: $(this).attr('href').replace(/\//g,''),
				name: $(this).text(),
				url:  'http://kat.ph' + $(this).attr('href'),
				source: 'kat'
			};
			shows.push(show);
		});
		callback(shows);
	});
};

/**
 * Get episode listings for a single show
 * 
 * @param  {String}   id       The ID from list()
 * @param  {Function} callback (episode) - episode is info for one episode
 */
exports.show = function(id, callback){
	get('http://kat.ph/' + id + '/', function($){
		$('a.infoListCut').each(function(i, el){
			var episode = {
				date: moment($(this).find('.versionsEpDate').text().replace(/ +/g,' '), 'dddd, MMMM D YYYY').utc().unix(),
				number: parseInt($(this).find('.versionsEpNo').text().match(/\d+/)[0], 10),
				name: $(this).find('.versionsEpName').text()
			};
			if ($(this).attr('onclick')){
				episode.id = $(this).attr('onclick').match(/\d+/)[0];
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
 * @param  {Function} callback (torrents) - list of all torrents, & "best" torrent for this show
 * @param  {Boolean}  findBest Try to find best torrent, instead of all of them?
 */
exports.torrents = function(id, callback, findBest){
	get('http://kat.ph/media/getepisode/' + id + '/', function($){
		var torrents = [];
		$('tr.odd, tr.even').each(function(i, el){
			var torrent = {
				name: $('.torrentname .font12px', this).text(),
				link: 'http://kat.ph' + $('.torrentname .font12px', this).attr('href'),
				magnet: $('a.imagnet', this).attr('href'),
				size: $('td.center', this).slice(0,1).text(),
				seed: $('td.center', this).slice(3,4).text(),
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

			torrents.push(torrent);
		});

		if (findBest){
			exports.findBest(torrents, function(best){
				callback(best);
			});
		}else{
			callback(torrents);
		}
	});
};

/**
 * Find "best" torrent, from a list of available torrents for a show
 *
 * Criteria for best is smallest file w/ seeds (I like low-quality torrents)
 * 
 * @param  {[type]}   torrents list of torrents available for a show
 * @param  {Function} callback callback with torrent object that is "best"
 */
exports.findBest = function(torrents, callback){
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

