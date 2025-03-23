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

# test: find & download True Blood Season 2
npm run find "Trueblood Season 2"

# server: find stuff you watch and download it
npm start
```

### docker

I have also setup all the services for docker-compose:

```bash
docker compose up -d

# test: find & download True Blood Season 2
npm run find "Trueblood Season 2"

# server: find stuff you watch and download it
npm start
```
