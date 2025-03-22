import { qBittorrentClient } from '@robertklep/qbittorrent'

export default class PluginQbitorrent {
  constructor(url) {
    const u = new URL(url)
    this.client = new qBittorrentClient(u.origin, u.username, u.password)
  }

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
}
