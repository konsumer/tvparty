var request = require('request'),
	fs = require('fs'),
	path = require('path'),
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
function updateSubscriptions(addPaused){
	subscriptions.forEach(function(show){
		request('http://www.dailytvtorrents.org/rss/show/' + show.id + '?' + show.options + '&onlynew=yes')
			
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
			// add subscriptions paused
			updateSubscriptions(true);
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
