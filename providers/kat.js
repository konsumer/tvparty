/*

Provider for kat.ph tv torrents

 */

var cheerio = require('cheerio'),
	zlib = require('zlib')
	http = require('http');


/**
 * Get list of shows
 * @param  {Function} callback (shows) - shows is array of info
*/
exports.list = function(callback){
	callback = callback || function(shows){};
	http.get({hostname:'kat.ph', path:'/tv/show/'}, function(res) {
		var chunks = [];
		res.pipe(zlib.createGunzip())
			.on('data', function (data) { chunks.push(data); })
			.on('end', function(){
				var buffer = Buffer.concat(chunks);
				var shows=[];
				var $ = cheerio.load(buffer, {ignoreWhitespace: true});
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
	})
};

/**
 * Get episode listings for a single show
 * @param  {String}   id       The ID from list()
 * @param  {Function} callback (episodes) - episodes is array of info
 */
exports.get = function(id, callback){
	callback = callback || function(shows){};
	http.get({hostname:'kat.ph', path: '/' + id + '/'}, function(res) {
		var chunks = [];
		res.pipe(zlib.createGunzip())
			.on('data', function (data) { chunks.push(data); })
			.on('end', function(){
				var buffer = Buffer.concat(chunks);
				var episodes = [];
				var $ = cheerio.load(buffer, {ignoreWhitespace: true});
				$('a.infoListCut').each(function(i, el){
					var episode = {
						date: $(this).find('.versionsEpDate').text().replace(/ +/g,' '),
						number: parseInt($(this).find('.versionsEpNo').text().match(/\d+/)[0], 10),
						name: $(this).find('.versionsEpName').text()
					};
					if ($(this).attr('onclick')){
						episode.id = $(this).attr('onclick').match(/\d+/)[0];
						http.get({hostname:'kat.ph', path: '/media/getepisode/' + episode.id + '/'}, function(res) {
							var chunks = [];
							res.pipe(zlib.createGunzip())
								.on('data', function (data) { chunks.push(data); })
								.on('end', function(){
									var buffer = Buffer.concat(chunks);
									var $ = cheerio.load(buffer, {ignoreWhitespace: true});
									$('tr.odd, tr.even').each(function(i, el){
										console.log($(el).html());
									});
								});
						});
					}

					episodes.push(episode);
				});
				callback(episodes);
			});
	});
};