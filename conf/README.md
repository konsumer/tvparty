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
    "add_dir":"/share/video/series"
}

```

## Optional

These are optional, and will be created if they don't exist, and you change your subscriptions or parse RSS.

### seen.json

This is an array of the GUID's of episodes you're RSS parser has seen (and tried to download.)

### subscriptions.json

These are your subscriptions, by ID.  For Game of Thrones & Doctor Who, it looks like this:

```json

[
	350,
	103
]

```

You can manage these, easily, by visiting the demo-app. Basically `id` is the name of the show, on [DailyTVTorrents](http://www.dailytvtorrents.org/) and `options` are the RSS options.  The ones you see are the default in the manager, because they seem to yield the best results.

