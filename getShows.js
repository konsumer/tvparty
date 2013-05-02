/**
 * This should not need to be run.
 * It just grabs a list of supported shows from showRSS
 */

var request = require('request'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	path = require('path');

var shows=[];

request('http://showrss.karmorra.info/?cs=feeds', function(err, res, body){
	var $ = cheerio.load(body, {ignoreWhitespace: true});
	$('select[name=show] option').each(function(i, el){
		shows.push({
			id: $(this).attr('value'),
			name: $(this).text()
		});
	});
});

process.on('exit', function(){
	fs.writeFileSync(path.join(__dirname, 'shows.json'), JSON.stringify(shows, null, 4));
});
