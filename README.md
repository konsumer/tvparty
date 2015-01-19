# TV Party

Uses [Kick Ass Torrents](http://kickass.to/) or [eztv](https://eztv.ch) and Transmission WebUI to automate adding torrents for all your favorite shows.

"We're gonna have a TV party, tonight, alright!"

It has no built-in security, and is intended to just run on your local network, and be protected from public consumption.

If you want to read a [blog post about it](http://blog.jetboystudio.com/articles/automated_tv/), sweet!

## Configuration

Make a file called `conf/settings.json` that looks like this:

```json

{
	"username": "USER",
	"password": "PASSWORD",
	"host": "192.168.1.5",
	"port": "9091",
	"updateTime": 15,
	"serve_port": 3000,
	"add_dir":"/share/video/series",
	"provider": "kat"
}

```

Set your username, password, etc. `updateTime` is how often, in minutes, to check the RSS feed. Anything lower than 15 is just excessive. `serve_port` is the port to listen on for requests.

`add_dir` is the directory where series will be put. It tries to guess name & season from name.

In the directory where these files are, run `npm install`, then `npm start`

`provider` can be `kat` or `eztv`.

## Install

You can install it as a service on ubuntu/debian, by copying `tvparty.init.sh` to `/etc/init.d/tvparty`, and run `update-rc.d tvparty defaults`


## REST API

I have made this primarily REST-API-based, so it can be integrated easily into other systems.  On [my NAS](http://blog.jetboystudio.com/2013/03/19/nas.html), I already have Apache running, I just need to GET/POST to mess with subscriptons, and have it running in the background to parse RSS.

Here is the API:

*  `GET /` - a demo subscription manager
*  `GET /shows` - get a list of all available shows
*  `GET /subscriptions` - get a list of current TV subscriptions
*  `POST /subscriptions` - set a list of current TV subscriptions, using JSON

I made a sweet admin at `http://{NAS_ADDRESS}:{SERVE_PORT}/` that you can use to modify your subscriptions.

## Testing

Run `npm test` to test the various parts of tvparty. See usage examples of the code in `test/` directory.

## TODO

- add streaming support
- add internal torrent client option
- split providers into seperate node modules
