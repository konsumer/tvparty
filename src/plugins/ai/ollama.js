import { Ollama } from 'ollama'

const { TVPARTY_OLLAMA } = process.env

if (!TVPARTY_OLLAMA) {
  console.error('TVPARTY_OLLAMA env-var is required. Please see README.')
  process.exit(1)
}

export default class PluginOllama {
  constructor() {
    const u = new URL(TVPARTY_OLLAMA)
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

  async query(messages, options = {}) {
    return this.client.chat({ model: this.model, messages, ...options })
  }
}
