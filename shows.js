
/*

Library to interact with showRSS

 */

var request = require('request'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	path = require('path');

/**
 * Get list of shows
 */
exports.getShows = function(callback){
	callback = callback || function(err, shows){};
	request('http://showrss.karmorra.info/?cs=feeds', function(err, res, body){
		if (err) return callback(err);
		var shows = [];
		var $ = cheerio.load(body, {ignoreWhitespace: true});
		$('select[name=show] option').each(function(i, el){
			shows.push({
				id: $(this).attr('value'),
				name: $(this).text()
			});
		});
		return callback(null, shows);
	});
}