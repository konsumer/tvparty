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
	"updateTime": 15
}

```

## Optional

These are optional, and will be created if they don't exist, and you change your subscriptions or parse RSS.

### seen.json

This is an array of the GUID's of episodes you've seen.

### subscriptions.json

These are your subscriptions.  Mine looks like this:

```json

[
	{
		"name": "Game of Thrones",
		"id": "game-of-thrones",
		"options":"prefer=720&wait=3"
	},
	{
		"name": "Doctor Who",
		"id": "doctor-who",
		"options":"prefer=720&wait=3"
	}
]

```

