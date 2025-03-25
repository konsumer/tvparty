const { TVPARTY_PLEX, TVPARTY_PLEX_TOKEN } = process.env

if (!TVPARTY_PLEX) {
  console.error('TVPARTY_PLEX env-var is required. Please see README.')
  process.exit(1)
}

if (!TVPARTY_PLEX_TOKEN) {
  console.error('TVPARTY_PLEX_TOKEN env-var is required. Please see README.')
  process.exit(1)
}

const headers = { accept: 'application/json, text/plain, */*', 'X-Plex-Token': TVPARTY_PLEX_TOKEN }

export default class PluginPlex {
  async check(print) {
    try {
      const { MediaContainer } = await fetch(`${TVPARTY_PLEX}/`, { headers }).then((r) => r.json())
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

  // search for something in library
  async search({ name, type, season, episode }) {
    const q = new URLSearchParams({
      query: name,
      limit: 1,
      searchTypes: type === 'show' ? 'tv' : 'movies',
      searchProviders: 'discover,plexAVOD,plexTVOD'
    })
    const [rlocal, rdiscover] = await Promise.all([fetch(`${TVPARTY_PLEX}/library/search?${q}`, { headers }).then((r) => r.json()), fetch(`https://discover.provider.plex.tv/library/search?${q}`, { headers }).then((r) => r.json())])
    const results = (rlocal?.MediaContainer?.SearchResult || []).map((r) => r.Metadata)
    const isLocal = !!results.length
    results.push(...((rdiscover?.MediaContainer?.SearchResults || []).find((i) => i.id === 'external')?.SearchResult || []).map((r) => r.Metadata))
    const show = results[0]
    if (show) {
      show.season = { index: season }
      show.episode = { index: episode }
      const base = isLocal ? TVPARTY_PLEX : 'https://discover.provider.plex.tv'
      if (season && episode && show.type === 'show' && show.key) {
        const s = ((await fetch(`${base}${show.key}`, { headers }).then((r) => r.json()))?.MediaContainer?.Metadata || []).find((s) => s.index === season)
        if (s) {
          show.season = s
          const e = ((await fetch(`${base}${s.key}`, { headers }).then((r) => r.json()))?.MediaContainer?.Metadata || []).find((s) => s.index === episode)
          if (e) {
            show.episode = e
          }
        }
      }
    }
    return show
  }
}
