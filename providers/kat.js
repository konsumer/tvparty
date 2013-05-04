/*

Provider for kat.ph tv torrents

 */

var request = require('request'),
	cheerio = require('cheerio'),
	zlib = require('zlib')
	http = require('http');


/**
 * Get list of shows
 * @param  {Function} callback (shows) - shows is array of ID/Name
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

exports.get = function(){

}