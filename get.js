var	ajax = require('superagent'),
	cheerio = require('cheerio');

/**
 * Shortcut for HTTP GET + cheerio-parse
 * 
 * @param  {String}   u        Full URL
 * @param  {Function} callback called with cheerio pseudo-jquery object for page
 */
module.exports = function(u, callback){
	ajax.get(u, function(error, res){
		callback(cheerio.load(res.text, {ignoreWhitespace: true}));
	});
};