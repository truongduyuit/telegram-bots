import axios from "axios"
import { CronJob } from "cron"
import { CHANNEL_SIGNAL_TYPE } from "types"
import db from "./db"

const cronjob = new CronJob("*/5 * * * * *", async function () {
    const [setting, signals, signals2] = await Promise.all([
        db.get("setting"),
        db.get("currSignals"),
        db.get("nextSignals"),
    ])

    const { botToken, channels } = JSON.parse(JSON.stringify(setting))
    const { currSignals = [] } = JSON.parse(JSON.stringify(signals))
    const { nextSignals = [] } = JSON.parse(JSON.stringify(signals2))

    console.log(`signals: ${currSignals.length} - channels: ${Object.keys(channels).length}`)

    await Promise.all(currSignals.map(async (s: CHANNEL_SIGNAL_TYPE) => {
        const { channelId, createdAt, message } = s
        const { alertDelay } = channels[channelId]

        if (Date.now() - createdAt >= +alertDelay * 1000) {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: channelId,
                text: message
            })
        } else {
            nextSignals.push(s)
        }
    }))

    await Promise.all([
        db.get('currSignals').then(function (doc) {
            return db.put({
                _id: 'currSignals',
                _rev: doc._rev,
                currSignals: nextSignals
            });
        }),
        db.get('nextSignals').then(function (doc) {
            return db.put({
                _id: 'nextSignals',
                _rev: doc._rev,
                currSignals: []
            });
        }),
        db.get('isRunJobs').then(function (doc) {
            return db.put({
                _id: 'isRunJobs',
                _rev: doc._rev,
                isRunJobs: false
            });
        }),
    ])
},
    null,
    true,
    'America/Los_Angeles'
)

export default cronjob