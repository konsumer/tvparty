/*

Provider for kat.ph tv torrents

 */

var request = require('request'),
	cheerio = require('cheerio')
	zlib = require('zlib');


/**
 * Get list of shows
 * @param  {Function} callback (err, shows) - shows is array of ID/Name

exports.getShows = function(callback){
	callback = callback || function(err, shows){};
	request('http://kat.ph/tv/show/', function(err, res, body){
		if (err) return callback(err);
		console.log(body);
		var shows = [];
		var $ = cheerio.load(body, {ignoreWhitespace: true});
		$('ul.textcontent a.plain').each(function(i, el){
			var show = {
				name: $(this).text(),
				url:  'http://kat.ph' + $(this).attr('href'),
				source: 'kat'
			};
			console.log(show);
			shows.push(show);
		});
		return callback(null, shows);
	});
};
 */

/**
 * Get list of shows
 * @param  {Function} callback (err, shows) - shows is array of ID/Name
*/
exports.getShows = function(callback){
	callback = callback || function(err, shows){};
	request({url:'http://kat.ph/tv/show/', 'headers': {'Accept-Encoding': 'gzip'} })
		.pipe(zlib.createGunzip())
		.finish(function(){
			console.log(arguments);
		});
};

/**
 * Get current list of torrents for a show
 * @param {Integer} show The ID of the show
 * @param  {Function} callback (err, links) - links is array of current episode torrents, parsed
 */
exports.getShow = function(show, callback){
	callback = callback || function(err, links){};
	request(show.url, function(err, res, body){
		if (err) return callback(err);
		var links = [];
		var $ = cheerio.load(body, {ignoreWhitespace: true, xmlMode:true});
		
		return callback(null, links);
	});
};
