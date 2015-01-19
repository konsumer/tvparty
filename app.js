var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	Transmission = require('transmission'),
	clone = require('clone'),
	events = require('events'),
	settings = require('./conf/settings.json'),
	transmission = new Transmission(settings),
	provider = require('./providers/' + settings.provider + '.js'),
	seen = {},
	subscriptions = [],
	shows = [];

// load optional stuff from JSON files, log if they are missing
try { seen = require('./conf/seen.json'); }catch(e){ console.log(e); }
try { subscriptions = require('./conf/subscriptions.json'); }catch(e){ console.log(e); }

/**
 * Get basic show info, by ID
 * @param  {String} id Show identifier
 * @return {Object}    Copy of show
 */
function getShow(id){
	for(var i in shows){
		if (shows[i].id == id){
			return clone(shows[i]);
		}
	}
}

/**
 * Update subscriptions, add torrents for new shows
 * @param  {Boolean} addPaused Add the torrent paused
 */
function updateSubscriptions(ignore, addPaused){
	subscriptions.forEach(function(id){
		var show = getShow(id);
		if (!show) return;
		provider.show(id)
			.on('episode', function(episode){
				if (episode.id && episode.has_torrents && !seen[show.id + '/' + episode.id]){
					seen[show.id + '/' + episode.id] = episode;
					if (!ignore){
						var torrents = [];
						provider.torrents(episode.id)
							.on('torrent', function(torrent){ torrents.push(torrent); })
							.on('end', function(){
								var options = {
									"download-dir": settings.add_dir + '/series ' + episode.season + '/' + getShow(episode.show).name
								};
								options.paused = (addPaused === true);
								transmission.add(provider.best(torrents).magnet, options, function(err, result){if (result) console.log('added', result.name); });
							});
					}
				}
			})
			.on('end', function(){
				fs.writeFile(path.join(__dirname, 'conf', 'seen.json'), JSON.stringify(seen), function(err){});
			});
	});
}

// just log transmission errors
transmission.on('error', function(err){
	console.log(err);
});

// update show-cache
provider.all()
	.on('show', function(show){
		shows.push(show);
	})
	.on('end', function(){
		updateSubscriptions();
	});

// run update/torrent-add every N minutes
setInterval(updateSubscriptions, 60000 * settings.updateTime);

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

// set status of a subscription
app.post('/subscriptions', function(req, res){
	var i = subscriptions.indexOf(req.body.id);
	if (req.body.val){
		if (i == -1) subscriptions.push(req.body.id);
	}else{
		if (i != -1) delete(subscriptions[i]);
	}
	
	// add subscriptions to seen, but not to transmission
	updateSubscriptions(true);

	// save subscriptions
	fs.writeFile(path.join(__dirname, 'conf', 'subscriptions.json'), JSON.stringify(subscriptions), function(err) {
		if(err){
			res.send(500, { error: "Could not save subscription file." });
		}else{
			res.send(subscriptions);
		}
	});
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
	info.subscribed = subscriptions.indexOf(req.params.id) != -1;
	provider.show(req.params.id)
		.on('episode', function(episode){
			episode.seen = (seen[req.params.id + '/' + episode.id]) ? true : false;
			info.episodes.push(episode);
			// couldn't get image from show-list, using episode-list
			info.image = episode.image;
		})
		.on('end', function(){
			res.send(info);
		});
});

app.listen(settings.serve_port);
console.log('Listening on http://0.0.0.0:' + settings.serve_port);

