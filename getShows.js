/**
 * This should not need to be run.
 * It just grabs a list of supported shows from DailyTVTorrents
 */

/*
var jsdom  = require("jsdom"),
	fs = require('fs'),
	path = require('path'),
	request = require('request'),
    window = jsdom.jsdom().createWindow();

var categories = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var shows=[];

// go to all the category pages on DailyTVTorrents, and grab the ID & name
categories.forEach(function(c){
	request('http://www.dailytvtorrents.org/show-list/' + c, function (error, response, body){
		jsdom.env({
			html: body,
			scripts: ['http://code.jquery.com/jquery-1.9.1.min.js']
		}, function (err, window) {
			var $ = window.jQuery;
			$('a.t4').each(function(){
				var $a = $(this);
				shows.push({
					id: $a.attr('href').split('/show/').pop().split('/').shift(),
					name: $a.text()
				});
			});
		});
	});
});

// fancy handler that writes file when all else is done
process.on('exit', function(){
	fs.writeFileSync(path.join(__dirname, 'shows.json'), JSON.stringify(shows, null, 4));
});
*/

var request = require('request')
	cheerio = require('cheerio');

request('http://showrss.karmorra.info/?cs=feeds', function(err, res, body){
	var $ = cheerio.load(body, {ignoreWhitespace: true});
	$('select[name=show] option').each(function(i, el){
		console.log(el);
	});
});
