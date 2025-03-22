import PlexAPI from 'plex-api'

export default class PluginPlex {
  constructor(url) {
    const u = new URL(url)
    this.client = new PlexAPI({
      hostname: u.hostname,
      port: u.port,
      https: u.protocol === 'https:',
      username: u.username,
      password: u.password,
      options: {
        deviceName: 'TVParty Agent'
      }
    })
  }

  async check(print) {
    try {
      const { MediaContainer } = await this.client.query('/')
      if (print) {
        console.log(`Connected to Plex: ${MediaContainer.friendlyName} (API v${MediaContainer.version})`)
      }
      return true
    } catch (error) {
      if (print) {
        console.error(`Failed to connect to Plex: ${error.message}`)
      }
      throw error
    }
  }
}
