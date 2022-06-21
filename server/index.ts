import next from 'next'
import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
// import { CronJob } from 'cron'

const SERVER_URL = "https://38c2-171-252-153-5.ngrok.io"
const TOKEN = "5478388041:AAG1TfNj--np-MBOwi5DcIgD-gm9iSKaLsw";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const port = parseInt(process.env.PORT || '5000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
  console.log(res.data)
}


// const channelWebhookId = "-1001767668653"
// const channels: { [key: string]: { id: string, delay: number } } = {
//   "-1001713291712": {
//     id: "-1001713291712",
//     delay: 5000
//   },
//   "-1001667666076": {
//     id: "-1001667666076",
//     delay: 10000
//   },
// }

// let isRunJobs = false
// let signals: {
//   channelId: string,
//   createdAt: number,
//   message: string
// }[] = []
// let nextSignals: {
//   channelId: string,
//   createdAt: number,
//   message: string
// }[] = []

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.text({ defaultCharset: 'utf-8' }))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  // server.post(URI, async (req: Request, res: Response) => {
  //   const tradingviewWebhookText = req.body

  //   Object.keys(channels).map(channel => {
  //     if (typeof tradingviewWebhookText === "string") {
  //       isRunJobs ? nextSignals.push({
  //         channelId: channels[channel].id,
  //         createdAt: Date.now(),
  //         message: tradingviewWebhookText
  //       }) : signals.push({
  //         channelId: channels[channel].id,
  //         createdAt: Date.now(),
  //         message: tradingviewWebhookText
  //       })
  //     } else {
  //       const { chat, text } = req.body.channel_post;
  //       if (chat.id.toString() === channelWebhookId) {
  //         isRunJobs ? nextSignals.push({
  //           channelId: channels[channel].id,
  //           createdAt: Date.now(),
  //           message: text
  //         }) : signals.push({
  //           channelId: channels[channel].id,
  //           createdAt: Date.now(),
  //           message: text
  //         })
  //       }
  //     }
  //   })

  //   return res.send()
  // })

  // const job = new CronJob(
  //   // '* * * * * *',
  //   '*/5 * * * * *',
  //   async function () {
  //     isRunJobs = true
  //     console.log("cron start: ", signals.length)
  //     await Promise.all(signals.map(async s => {
  //       const { channelId, createdAt, message } = s
  //       const { delay } = channels[channelId]

  //       try {
  //         if (Date.now() - createdAt >= delay) {
  //           await axios.post(`${TELEGRAM_API}/sendMessage`, {
  //             chat_id: channelId,
  //             text: message
  //           })
  //         } else {
  //           nextSignals.push(s)
  //         }

  //       } catch (error) {
  //         nextSignals.push(s)
  //       }
  //     }))

  //     signals = nextSignals
  //     nextSignals = []
  //     isRunJobs = false
  //   },
  //   null,
  //   true,
  //   'America/Los_Angeles'
  // );

  // job.start()

  server.listen(port, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
    await init()
})

  // // tslint:disable-next-line:no-console
  // console.log(
  //   `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
  //   }`
  // )
})
