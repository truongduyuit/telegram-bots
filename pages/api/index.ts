import type { NextApiRequest, NextApiResponse } from 'next'
import { AlertJob } from 'services/AlertJob'
import cronjob from 'services/job'

type Data = {
    ok: boolean,
    data: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { serverUrl, botToken, channels } = req.body

    const webhookUrl = await AlertJob.setting(serverUrl, botToken, channels)
    await cronjob.start()

    return res.status(200).json({ ok: true, data: { botToken, serverUrl, channels, webhookUrl } })
}