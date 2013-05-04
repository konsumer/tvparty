/*

Provider for kat.ph tv torrents

 */

var http = require('http'),
	cheerio = require('cheerio')
	zlib = require('zlib')
	fs=require('fs');


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
	var request = http.get({ host: 'kat.ph',
		path: '/tv/show/',
		port: 80,
		headers: { 'accept-encoding': 'gzip,deflate' } });
	request.on('response', function(res) {
		var output = fs.createWriteStream('kat.list');
		res.pipe(zlib.createGunzip()).pipe(output);
	});
	request.on('data', function(){
		console.log(arguments);
	});
};

