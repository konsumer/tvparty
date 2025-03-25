#!/usr/bin/env node --no-deprecation -r dotenv/config

// This will login to plex and get your a token

import PlexAPI from 'plex-api'

const [node, script, username, password, url = process.env.TVPARTY_PLEX || 'http://localhost:32400'] = process.argv

if (!username || !password) {
  const name = script.split(/[\\\/]/).pop()
  console.error(`Usage: ${name} USERNAME PASSWORD <URL>`)
  process.exit(1)
}

const u = new URL(url)

const client = new PlexAPI({
  hostname: u.hostname,
  port: u.port,
  https: u.protocol === 'https:',
  username,
  password,
  options: {
    deviceName: 'TVParty Agent'
  }
})

const { MediaContainer } = await client.query('/')

console.log(`TVPARTY_PLEX=${url}
TVPARTY_PLEX_TOKEN=${client.authToken}`)
