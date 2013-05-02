
/*

Library to interact with showRSS

 */

var request = require('request'),
	cheerio = require('cheerio'),
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
};

exports.getShow = function(callback){
	callback = callback || function(err, links){};
	request('http://showrss.karmorra.info/feeds/' + show + '.rss', function(err, res, body){
		var $ = cheerio.load(body, {ignoreWhitespace: true, xmlMode:true});
		$('item').each(function(i, el){
			// TODO: something smart to parse out quality, season, episode, name, group
			seen.push({
				show: show,
				title: $(this).children('title').text(),
				torrent: $(this).children('link').text()
			});
		});
	});
}