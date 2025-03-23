// TODO: eventually I will have a whole plugin-system here, but for now it's hardcoded
import PluginOllama from './plugins/ai/ollama.js'
import PluginQbitorrent from './plugins/torrent/qtorrent.js'
import PluginPlex from './plugins/library/plex.js'

const { TVPARTY_OLLAMA, TVPARTY_QTORRENT, TVPARTY_PLEX } = process.env

if (!TVPARTY_OLLAMA) {
  console.error('TVPARTY_OLLAMA env-var is required. Please see README.')
  process.exit(1)
}

if (!TVPARTY_QTORRENT) {
  console.error('TVPARTY_QTORRENT env-var is required. Please see README.')
  process.exit(1)
}

if (!TVPARTY_PLEX) {
  console.error('TVPARTY_PLEX env-var is required. Please see README.')
  process.exit(1)
}

export default async function loadPlugins(print) {
  const plugins = {
    ai: new PluginOllama(TVPARTY_OLLAMA),
    torrent: new PluginQbitorrent(TVPARTY_QTORRENT),
    library: new PluginPlex(TVPARTY_PLEX)
  }
  for (const plugin of Object.values(plugins)) {
    if (plugin.check) {
      await plugin.check(print)
    }
  }
  return plugins
}
