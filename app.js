var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	Transmission = require('transmission'),
	settings = require('./conf/settings.json'),
	transmission = new Transmission(settings),
	seen = [],
	subscriptions = []
	shows = [];

// load optional stuff from JSON files
try { seen = require('./conf/seen.json'); }catch(e){ console.log(e); }
try { subscriptions = require('./conf/subscriptions.json'); }catch(e){ console.log(e); }

var provider = require('./providers/' + settings.provider + '.js');

/**
 * Store cache of shows in memory
 */
function updateShows(){
	shows = [];
	provider.all()
		.on('show', function(show){
			shows.push(show);
		})
		.on('end', function(){
			updateSubscriptions();
		});
}

/**
 * [getShowName description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function getShow(id){
	for(i in shows){
		if (shows[i].id == id){
			return shows[i];
			break;
		}
	}
}

/**
 * [updateSubscriptions description]
 * @param  {[type]} addPaused [description]
 */
function updateSubscriptions(addPaused){
	subscriptions.forEach(function(show){
		provider.show(show)
			.on('episode', function(episode){
				// find episode in seen list, or add it to transmission
				if (episode.id && episode.has_torrents){
					var found=false;
					for (i in seen){
						if (episode.id == seen[i].id){
							found = true;
							break;
						}
					}
					if (!found){
						seen.push(episode);
						var torrents = [];
						provider.torrents(episode.id)
							.on('torrent', function(torrent){ torrents.push(torrent); })
							.on('end', function(){
								var options = {
									"download-dir": settings.add_dir + '/' + getShow(episode.show).name
								};
								options.paused = (addPaused === true);
								transmission.add(provider.best(torrents).magnet, options, function(err, arg){
									if (err) console.log(err);
									console.log(arg);
								});
							});
					}
				}
				
			})
			.on('end', function(){
				fs.writeFile(path.join(__dirname, 'conf', 'seen.json'), JSON.stringify(seen, null, 4), function(){});
			});

	});
	
	
}

updateShows();
setInterval(updateSubscriptions, 60000 * settings.updateTime); // run update every N minutes


////////////////////////

var app = express();

// serve demo
app.use(express.static(path.join(__dirname, 'public')));


// serve up REST API

app.use(express.bodyParser());
app.use(express.logger());

// cross-domain
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
});

// set list of current subscriptions
app.post('/subscriptions', function(req, res){
	var old_subscriptions = subscriptions.slice();

	try{		
		// find entry with same id, remove it
		for (i in subscriptions){
			if (req.body.id == subscriptions[i]){
				subscriptions.splice(i,1);
				break;
			}
		}

		// add it back, if it's checked
		if (req.body.val && req.body.val != 'false'){
			subscriptions.push(req.body.id);
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
			// add subscriptions paused
			updateSubscriptions(true);
		}
	}catch(e){
		res.send(500, { error: e });
		console.log(e);
	}
});

// get list of current subscriptions
app.get('/subscriptions', function(req, res){
	res.send(subscriptions);
});

// get list of available shows
app.get('/shows', function(req, res){
	res.send(shows);
});

// get detailed info about a show
app.get('/show/:id', function(req, res){
	var info = getShow(req.params.id);
	info.episodes=[];
	provider.show(req.params.id)
		.on('episode', function(episode){
			info.episodes.push(episode);
			info.image = episode.image;
		})
		.on('end', function(){
			res.send(info);
		});
});

app.listen(settings.serve_port);
console.log('Listening on http://0.0.0.0:' + settings.serve_port);
