import axios from "axios";
import { CHANNEL_ALERT_TYPE, CHANNEL_SIGNAL_TYPE } from "types";
import db from "./db";

export class AlertJob {
    /**
     * 
     * @param serverUrl server start app https
     * @param botToken bot token
     * @param channelSignalId channel id receive signals from tradingview
     * @param channels config channel receive signals have delay
     */
    public static async setting(serverUrl: string, botToken: string, channels: CHANNEL_ALERT_TYPE) {
        await Promise.all([
            db.get('setting').then(function (doc) {
                return db.put({
                    _id: 'setting',
                    _rev: doc._rev,
                    serverUrl, botToken, channels
                });
            }),
            db.get('isRunJobs').then(function (doc) {
                return db.put({
                    _id: 'isRunJobs',
                    _rev: doc._rev,
                    isRunJobs: false
                });
            }),
            db.get('currSignals').then(function (doc) {
                return db.put({
                    _id: 'currSignals',
                    _rev: doc._rev,
                    currSignals: []
                });
            }),
            db.get('nextSignals').then(function (doc) {
                return db.put({
                    _id: 'nextSignals',
                    _rev: doc._rev,
                    nextSignals: []
                });
            })
        ])

        const TELEGRAM_URL = `https://api.telegram.org/bot${botToken}`
        const WEBHOOK_URL = `${serverUrl}/api/${botToken}`
        await axios.get(`${TELEGRAM_URL}/setWebhook?url=${WEBHOOK_URL}`)

        return WEBHOOK_URL
    }

    /**
     * 
     * @param message signals from trading view
     */
    public static async pushSignal(message: string) {
        console.log("received: ", message)

        const setting = await db.get("setting")
        const { channels } = JSON.parse(JSON.stringify(setting))

        const signals: CHANNEL_SIGNAL_TYPE[] = []
        Object.keys(channels).map(async channel => {
            signals.push({
                channelId: channels[channel].id,
                createdAt: Date.now(),
                message: message
            })
        })

        await db.get('nextSignals').then(function (doc) {
            const { nextSignals = [] } = JSON.parse(JSON.stringify(doc))

            return db.put({
                _id: 'nextSignals',
                _rev: doc._rev,
                nextSignals: [...nextSignals, ...signals]
            }, { force: true });
        })
    }
}