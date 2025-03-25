import { setup, search, getDownloadDir } from './engine.js'

const [node, script, query] = process.argv

if (!query) {
  const name = script.split(/[\\\/]/).pop()
  console.error(`Usage: ${name} "QUERY"`)
  process.exit(1)
}

const plugins = await setup()
const { info, selectedTorrents } = await search(plugins, query)

if (!selectedTorrents?.length) {
  console.log('No torrents found. quitting.')
  process.exit()
}

const downloadDir = getDownloadDir(info)

if (info?.type === 'show') {
  console.log(`Adding ${info.title} Season ${info.season.index} Episode ${info.episode.index} - ${info.episode.title} to downloads in ${downloadDir}`)
}
if (info?.type === 'movie') {
  console.log(`Adding ${info.title} to downloads in ${downloadDir}`)
}
const torrent = await plugins.torrent.add(selectedTorrents[0].url, downloadDir)
if (!torrent) {
  console.log('Torrent not added for some reason. quitting.')
  process.exit()
}
