import next from 'next'
import express from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
import "../services/db"

const port = parseInt(process.env.PORT || '5000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.text({ defaultCharset: 'utf-8' }))
  server.use(cors({credentials : true }))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
  })
})
