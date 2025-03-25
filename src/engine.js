// TODO: eventually I will have a whole plugin-system here, but for now it's hardcoded
import PluginOllama from './plugins/ai/ollama.js'
import PluginQbitorrent from './plugins/torrent/qtorrent.js'
import PluginPlex from './plugins/library/plex.js'
import path from 'node:path'

const { TVPARTY_DOWNLOAD_MOVIE = 'movies', TVPARTY_DOWNLOAD_SERIES = 'series' } = process.env

// setup plugins
export async function setup(print) {
  const plugins = {
    ai: new PluginOllama(),
    torrent: new PluginQbitorrent(),
    library: new PluginPlex()
  }
  for (const plugin of Object.values(plugins)) {
    if (plugin.check) {
      await plugin.check(print)
    }
  }
  return plugins
}

// guese series info
// this may eventually be replaced by some dumb parsing function (instead of AI)
async function guessSeriesInfo(plugins, query) {
  const r = await plugins.ai.query([
    {
      role: 'system',
      content: `You are an AI driven function that can return information about a user's query relating to tv series and movies. For example "The Simpsons S02E10" whould return this:
{
  "name": "The Simpsons",
  "type": "show",
  "season": 2,
  "episode": 10
}

A query like "the shining" would return this:

{
  "name": "The Shining",
  "type": "movie"
}

Try to guess based on clues like if it's a known movie-title, it would be type:movie, or if it has strings like "S2E1" it's a show, since that is season/episode.
`
    },
    { role: 'user', content: query }
  ])
  try {
    return JSON.parse(r?.message?.content || 'null')
  } catch (e) {
    console.error('Error: ' + e.message)
    return null
  }
}

// do a torrent search, then pick the best one
export async function search(plugins, query, print = false) {
  let info = await guessSeriesInfo(plugins, query)

  if (!info) {
    if (print) {
      console.log(`Could not find ${query}`)
    }
    return
  }

  info = await plugins.library.search(info)

  const mediaInfo = {
    title: info.title,
    originallyAvailableAt: info.originallyAvailableAt
  }

  if (info.type === 'show') {
    mediaInfo.seasonNum = info.season.index
    mediaInfo.episodeNum = info.episode.index
    mediaInfo.episodeTitle = info.episode.title
  }

  let q = info.title
  if (info.type === 'show' && info.season && info.episode) {
    q += ` S${info.season.index.toString().padStart(2, '0')}E${info.episode.index.toString().padStart(2, '0')}`
  }

  if (info?.episode?.Media?.length) {
    if (print) {
      if (info?.episode?.title) {
        q += ` ("${info.episode.title}")`
      }
      console.log(`${q} has already been downloaded to "${info.librarySectionTitle}"`)
    }
    return []
  }

  if (print) {
    console.log(`Checking library & searching for torrents for ${q}`)
  }

  const torrents = (await plugins.torrent.search(q)).filter((t) => t.name.toLowerCase().includes(info.title.toLowerCase()))
  const prompt = `You are an AI-agent function that finds video (tv/movies) from a fileserver, for the user.

media-info:

${JSON.stringify(mediaInfo, null, 2)}


files-array:

${JSON.stringify(
  torrents.slice(0, 20).map((t, index) => ({
    index,
    name: t.name,
    fileSize: t.size,
    peers: t.peer,
    seeds: t.seed
  })),
  null,
  2
)}

Here is how to determine "goodness":

- They prefer 1080p video
- They prefer medium quality, smaller size is better
- More peers & seeds is best
- Choose the smallest filesize, unless it's so small it is probably not real (based on video codec, it us unrealaisticly small)
- There will often be results that are the wrong show (not the series/movie the user is looking for) so do not pick those
`

  const userQuery = `"${query}" is what I am looking for. Please output only the index field(s) of the items from the files-array, that best matches the query, in a JSON array. Put candidates in order of "goodness". If none of them seem to be a good candidate, output an empty JSON array ([]). Only output a single JSON array, no explanation or anything else, and do not wrap it in markdown. For example, if you pick indexes 5,6,7 you would only output this:
[5,6,7]`

  if (print) {
    console.log(prompt + '\n\n' + userQuery)
  }
  const r = await plugins.ai.query([
    { role: 'system', content: prompt },
    {
      role: 'user',
      content: userQuery
    }
  ])
  if (print) {
    console.log(r.message.content)
  }

  const out = { allTorrents: torrents, info, selectedTorrents: [] }
  try {
    out.selectedTorrents = JSON.parse(r.message.content).map((searchIndex) => torrents.find((t, index) => searchIndex === index))
  } catch (e) {}
  return out
}

// output a good download location
// https://support.plex.tv/articles/naming-and-organizing-your-tv-show-files/
// https://support.plex.tv/articles/naming-and-organizing-your-movie-media-files/
export async function getDownloadDir(info) {
  if (info.type === 'show') {
    return path.join(TVPARTY_DOWNLOAD_SERIES, `${info.title} (${info.year})`, `Season ${info.season.index}`)
  } else {
    return path.join(TVPARTY_DOWNLOAD_MOVIE, `${info.title} (${info.year})`)
  }
}
