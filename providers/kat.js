/*

Provider for kat.ph tv torrents

 */

var moment = require('moment');

/**
 * Shortcut for zlib GET + cheerio-parse
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
 * @param  {String}   id       The ID from list()
 * @param  {Function} callback (episode) - episode is info for one episode (called many times)
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
 * Get more specific info for a single episode
 * @param  {String}   id       The ID from list()
 * @param  {Function} callback (episode) - episode is info for one episode (called many times)
 */
exports.episode = function(episode, callback){
	get('http://kat.ph/media/getepisode/' + episode.id + '/', function($){
		episode.torrents = [];
		$('tr.odd, tr.even').each(function(j, el){
			var torrent = {
				name: $('.torrentname .font12px', this).text(),
				link: 'http://kat.ph' + $('.torrentname .font12px', this).attr('href'),
				magnet: $('a.imagnet', this).attr('href'),
				size: $('td.center', this).slice(0,1).text(),
				files: $('td.center', this).slice(1,2).text(),
				age: $('td.center', this).slice(2,3).text(),
				seed: $('td.center', this).slice(3,4).text(),
				leech: $('td.center', this).slice(4,5).text(),
			};

			// normalize

			var num = parseFloat(torrent.size);
			if (torrent.size.indexOf('TB')!=-1){
				torrent.size = num * 1024 * 1024 * 1024 * 1024;
			}else if (torrent.size.indexOf('GB')!=-1){
				torrent.size = num * 1024 * 1024 * 1024;
			}else if (torrent.size.indexOf('MB')!=-1){
				torrent.size = num * 1024 * 1024;
			}else if (torrent.size.indexOf('KB')!=-1){
				torrent.size = num * 1024;
			}else{
				torrent.size = num;
			}

			torrent.files = parseInt(torrent.files, 10);
			torrent.seed = parseInt(torrent.seed, 10);
			torrent.leech = parseInt(torrent.leech, 10);

			episode.torrents.push(torrent);
		});
		callback(episode);
	});
};

