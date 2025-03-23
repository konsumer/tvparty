// this will start a UI for subscribing to shows and interacting with server

import express from 'express'
import ViteExpress from 'vite-express'
import loadPlugins from './plugins.js'

const { PORT = 3000 } = process.env

const plugins = await loadPlugins(true)

const app = express()

app.get('/message', (_, res) => res.send('Hello from express!'))

ViteExpress.listen(app, PORT, () => console.log(`Server is listening on http://0.0.0.0:${PORT}`))
