
var request = require('request'),
	fs = require('fs'),
	FeedParser = require('feedparser'),
	express = require('express'),
	Transmission = require('transmission')
	settings = require('./conf/settings.json')
	transmission = new Transmission(settings),
	seen = [],
	subscriptions = [],
	shows = require('./shows.json');

// load optional stuff from JSON files
try { seen = require('./conf/seen.json'); }catch(e){}
try { subscriptions = require('./conf/subscriptions.json'); }catch(e){}

// grab RSS for all your favorite shows
function updateSubscriptions(){
	subscriptions.forEach(function(show){
		request('http://www.dailytvtorrents.org/rss/show/' + show.id + '?' + show.options + '&onlynew=yes').pipe(new FeedParser())
			.on('error', function(err) { throw err;	})
			
			.on('article', function (article) {
				var dir = show.name;

				var ep_data = article.title.match('S([0-9]+)E([0-9]+)');
				if (ep_data[1] && ep_data[2]){
					dir += '/series ' + ep_data[1];
				}

				article.enclosures.forEach(function(enc){
					if (enc.type == 'application/x-bittorrent' && seen.indexOf(article.guid) === -1){
						console.log(article.title);
						transmission.add(enc.url, {
							"download-dir": '/share/video/series/' + dir,
							"autostart": true,
						}, function(){});
						seen.push(article.guid);
						console.log(article.guid);
						console.log(dir);
						console.log("");
					}
				});
			})

			.on('end', function () {
				fs.writeFile('./conf/seen.json', JSON.stringify(seen, null, 4), function(err) {
					if(err) throw(err);
				});
			});
	});
}

updateSubscriptions();
setTimeout(updateSubscriptions, 60000 * settings.updateTime); // run update every N minutes

// serve up REST API & simple demo

var app = express();
app.use(express.bodyParser());
app.use(express.logger());
app.use(express.static('public'));


// get list of current subscriptions
app.get('/subscriptions', function(req, res){
	res.send(subscriptions);
});

// set list of current subscriptions
app.post('/subscriptions', function(req, res){
	try{
		subscriptions = JSON.parse(req.body);
		fs.writeFile('./conf/subscriptions.json', JSON.stringify(seen, null, 4), function(err) {
			if(err)
				res.send(500, { error: "Could not save subscription file." });
		});
	}catch(e){
		res.send(500, { error: "Bad POST. Use JSON." });
	}
});

// get list of available shows
app.get('/shows', function(req, res){
	res.send(shows);
});

app.listen(settings.serve_port);
console.log('Listening on http://0.0.0.0:' + settings.serve_port);