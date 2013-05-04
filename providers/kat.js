/*

Provider for kat.ph tv torrents

 */

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
exports.list = function(callback){
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
exports.get = function(id, callback){
	get('http://kat.ph/' + id + '/', function($){
		$('a.infoListCut').each(function(i, el){
			var episode = {
				date: $(this).find('.versionsEpDate').text().replace(/ +/g,' '),
				number: parseInt($(this).find('.versionsEpNo').text().match(/\d+/)[0], 10),
				name: $(this).find('.versionsEpName').text()
			};
			if ($(this).attr('onclick')){
				episode.id = $(this).attr('onclick').match(/\d+/)[0];
				get('http://kat.ph/media/getepisode/' + episode.id + '/', function($){
					episode.torrents = [];
					$('tr.odd, tr.even').each(function(j, el){
						var torrent = {
							name: $('.torrentname .font12px', this).text(),
							link: 'http://kat.ph' + $('.torrentname .font12px', this).attr('href'),
							size: $('td.center', this).get(0).text(),
						};
						episode.torrents.push(torrent);
					});
					callback(episode);
				});
			}else{
				callback(episode);
			}
		});
	});
};


