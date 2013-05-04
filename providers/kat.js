/*

Provider for kat.ph tv torrents

 */

var request = require('request'),
	cheerio = require('cheerio'),
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


exports.list = function(callback){
	callback = callback || function(err, shows){};
	request({
		url:'http://kat.ph/tv/show/',
		'headers': {'Accept-Encoding': 'gzip'}
	})
	.pipe(zlib.createGunzip())
	.on('end', function(){
		console.log(arguments);
	})
};

