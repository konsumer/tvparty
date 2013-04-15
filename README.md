# TV Party

Uses [DailyTVTorrents](http://www.dailytvtorrents.org/) and Transmission WebUI to automate adding torrents for all your favorite shows.

"We're gonna have a TV party, tonight, alright!"

## Configuration

Make a file called `conf/settings.json` that looks like this:

```json

{
	"username": "USER",
	"password": "PASSWORD",
	"host": "192.168.1.5",
	"port": "9091",
	"updateTime": 15
}

```

Set your username, password, etc.  updateTime is how often, in minutes, to check the RSS feed. Anything lower than 15 is just excessive.

In the directory where these files are, run `npm install`, then `node app.js`


## REST API

I have made this primarily REST-API-based, so it can be integrated easily into other systems.  On [my NAS](http://blog.jetboystudio.com/2013/03/19/nas.html), I already have Apache running, I just need to GET/POST to mess with subscriptons, and have it running in the background to parse RSS.

