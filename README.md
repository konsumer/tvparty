# tvparty

This is an agentic AI setup, where ollama is used to find and download tv/movie torrents for you.

![SpongeBob watching TV](https://media1.tenor.com/m/p95koflTx1wAAAAC/movie-night-movie-time.gif)

## setup

### manual

- Run [ollama](https://ollama.com/)
- Run [plex server](https://www.plex.tv/)
- Run [qBittorrent](https://www.qbittorrent.org/) with WebUi enabled
- Setup some qtorrent search plugins
- *Test*: can you manually find torrents and download them for a show you like?
- *Test*: if you put a video file in your "tv" library on plex, does it show in UI?

Once that is verified:

```bash
git clone https://github.com/konsumer/tvparty
cd tvparty
npm i

# edit your configuration
cp env.example .env

# run this to get your plex token (and add it's output to your .env)
npm run plex_login USERNAME PASSWORD URL

# test: find & download True Blood Season 2, Episode 1
npm run find "Trueblood S2E1"

# server: find stuff you watch and download it
npm start
```

### docker

I have also setup all the services for docker-compose:

```bash
docker compose up -d

# test: find & download True Blood Season 2
npm run find "Trueblood S2E1"

# server: find stuff you watch and download it
npm start
```

### TODO

- I think it might be better to use [parse-torrent-title](https://www.npmjs.com/package/parse-torrent-title) instead of AI to parse search, and look at torrent results.
- subscribe to shows
- setup calendar for upcoming shows
- periodically search for episodes that could have aired but are not downloaded/downloading
- finish docker-compose setup
- make video showing how to set it up
