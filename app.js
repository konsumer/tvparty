var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	FeedParser = require('feedparser'),
	express = require('express'),
	Transmission = require('transmission')
	settings = require('./conf/settings.json')
	transmission = new Transmission(settings),
	seen = [],
	subscriptions = [],
	shows = require('./shows.json');

// load optional stuff from JSON files
try { seen = require('./conf/seen.json'); }catch(e){ console.log(e); }
try { subscriptions = require('./conf/subscriptions.json'); }catch(e){ console.log(e); }

// grab RSS for all your favorite shows
function updateSubscriptions(){
	subscriptions.forEach(function(show){
		request('http://www.dailytvtorrents.org/rss/show/' + show.id + '?' + show.options + '&onlynew=yes').pipe(new FeedParser())
			.on('error', function(err){
				console.log(err);
			})

			.on('article', function (article) {
				var dir = article.meta.title.replace(' episodes at DailyTvTorrents.org','');

				var ep_data = article.title.match('S([0-9]+)E([0-9]+)');
				if (ep_data[1] && ep_data[2]){
					dir += '/series ' + ep_data[1];
				}

				article.enclosures.forEach(function(enc){
					if (enc.type == 'application/x-bittorrent' && seen.indexOf(article.guid) === -1){
						console.log(article.title);
						console.log(article.guid);
						console.log(dir);
						try{
							transmission.add(enc.url, {
								"download-dir": settings.add_dir + '/' + dir,
								"autostart": true,
							}, function(){});
							seen.push(article.guid);
						}catch(e){
							console.log(e);
						}
						console.log("");
					}
				});
			})

			.on('end', function () {
				fs.writeFile(path.join(__dirname, 'conf', 'seen.json'), JSON.stringify(seen, null, 4), function(err) {
					if(err) console.log(err);
				});
			});
	});
}

updateSubscriptions();
setInterval(updateSubscriptions, 60000 * settings.updateTime); // run update every N minutes

// serve up REST API & simple demo

var app = express();

app.use(express.bodyParser());
app.use(express.logger());

// cross-domain
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
});

// serve demo
app.use(express.static(path.join(__dirname, 'public')));


// get list of current subscriptions
app.get('/subscriptions', function(req, res){
	res.send(subscriptions);
});

// set list of current subscriptions
app.post('/subscriptions', function(req, res){
	var old_subscriptions = subscriptions.slice();

	try{		
		// find entry with same id, remove it
		for (i in subscriptions){
			if (req.body.id == subscriptions[i].id){
				subscriptions.splice(i,1);
				break;
			}
		}

		// add it back, if it's checked
		if (req.body.val && req.body.val != 'false'){
			subscriptions.push({
				id: req.body.id,
				options:"prefer=720&wait=3"
			});
		}

		// save it, and update
		if (old_subscriptions != subscriptions){
			fs.writeFile(path.join(__dirname, 'conf', 'subscriptions.json'), JSON.stringify(subscriptions, null, 4), function(err) {
				if(err){
					res.send(500, { error: "Could not save subscription file." });
				}else{
					res.send(subscriptions);
				}
			});
			updateSubscriptions();
		}
	}catch(e){
		res.send(500, { error: e });
		console.log(e);
	}
});

// get list of available shows
app.get('/shows', function(req, res){
	res.send(shows);
});

app.listen(settings.serve_port);
console.log('Listening on http://0.0.0.0:' + settings.serve_port);
