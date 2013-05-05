# Configuration

Your config files go in this directory.

## settings.json

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

## Optional

These files are optional, and will be created if they don't exist, and you change your subscriptions or parse RSS.

### seen.json

This is an array of the GUID's of episodes you're RSS parser has seen (and tried to download.)

### subscriptions.json

These are your subscriptions, by ID.  For "Game of Thrones" & "Doctor Who", it looks like this:

```json

[
	"game-of-thrones-tv24493",
    "doctor-who-(2005)-tv3332"
]

```

You can manage these, easily, by visiting the demo-app. These are show IDs from [Kickass Torrents](http://kat.ph/tv/show/).
