import { qBittorrentClient } from '@robertklep/qbittorrent'
import { remote } from 'parse-torrent'
import { promisify } from 'node:util'

const parseTorrent = promisify(remote)

const { TVPARTY_QTORRENT } = process.env

if (!TVPARTY_QTORRENT) {
  console.error('TVPARTY_QTORRENT env-var is required. Please see README.')
  process.exit(1)
}

const sleep = (t) => new Promise((resolve, reject) => setTimeout(resolve, t))

export default class PluginQbitorrent {
  constructor() {
    const u = new URL(TVPARTY_QTORRENT)
    this.client = new qBittorrentClient(u.origin, u.username, u.password)
  }

  // check if all is working well
  async check(print) {
    try {
      await this.client.auth.login()
      const version = await this.client.app.version()
      if (print) {
        console.log(`Connected to qBittorrent: (API ${version})`)
      }
      return true
    } catch (error) {
      if (print) {
        console.error(`Failed to connect to qBittorrent: ${error.message}`)
      }
      throw error
    }
  }

  // search for a torrent
  async search(term, searchTime = 10000) {
    const i = await this.client.search.start(term)
    await sleep(searchTime)
    const results = await this.client.search.results(i)
    await this.client.search.stop(i)
    return results.map((r) => {
      return { name: r.fileName, url: r.fileUrl, size: r.fileSize, peer: r.nbLeechers, seed: r.nbSeeders }
    })
  }

  // add a torrent
  async add(url, location) {
    const r = await this.client.torrents.add(url)
    const info = await parseTorrent(url)
    const torrents = await this.client.torrents.info()

    if (location) {
      await this.client.torrents.setLocation(info.infoHash, location)
    }

    // TODO: should I also find the actual media file (when there is a directory) and rename it?

    return torrents.find((t) => t.hash === info.infoHash)
  }
}
