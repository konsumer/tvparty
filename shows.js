
/*

Library to interact with showRSS

 */

var request = require('request'),
	cheerio = require('cheerio');

/**
 * Get list of shows
 * @param  {Function} callback (err, shows) - shows is array of ID/Name
 */
var getShows = function(callback){
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

/**
 * Get current list of torrents
 * @param  {Function} callback (err, links) - links is array of current episode torrents, parsed
 */
var getShow = function(callback){
	callback = callback || function(err, links){};
	request('http://showrss.karmorra.info/feeds/' + show + '.rss', function(err, res, body){
		if (err) return callback(err);
		var links = [];
		var $ = cheerio.load(body, {ignoreWhitespace: true, xmlMode:true});
		$('item').each(function(i, el){
			var link = {
				show: show,
				original_title: $(this).children('title').text(),
				torrent: $(this).children('link').text()
			};
			links.push(Object.create( link, parseTitle(link.original_title)));
		});
		return callback(null, links);
	});
};

/**
 * Parse a title into extra data
 * @param  {String} title [description]
 * @return {Object}       A parsed object containing name, season, episode, and 
 */
var parseTitle = function(title){
	var info = {};

	return info;
};