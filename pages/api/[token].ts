import type { NextApiRequest, NextApiResponse } from 'next'
import { AlertJob } from 'services/AlertJob'

type Data = {
    ok: boolean,
    data: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const tradingviewWebhookText = req.body

    if (typeof tradingviewWebhookText === "string") {
        AlertJob.pushSignal(tradingviewWebhookText)
    }

    return res.status(200).json({ ok: true, data: { tradingviewWebhookText } })
}