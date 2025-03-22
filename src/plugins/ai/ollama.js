import { Ollama } from 'ollama'

export default class PluginOllama {
  constructor(url) {
    const u = new URL(url)
    this.client = new Ollama({ host: u.origin })
    this.model = u.pathname.slice(1)
  }

  async check(print) {
    try {
      const info = await this.client.show({ model: this.model })

      if (print) {
        console.log(`Connected to Ollama: ${info.model_info['general.basename']} (last modified: ${info.modified_at}))`)
      }

      return true
    } catch (error) {
      if (print) {
        console.error(`Failed to connect to Ollama: ${error.message}`)
      }
      throw error
    }
  }
}
