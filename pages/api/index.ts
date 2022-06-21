import type { NextApiRequest, NextApiResponse } from 'next'
// import {Cache} from 'server/cache'

type Data = {
    ok: boolean, 
    data: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { botToken, channelSignalId, channels} = req.body

    // const cache = Cache.
    // cache.set(botToken, JSON.stringify({botToken, channelSignalId, channels}))
    // console.log("123: ", await cache.get(botToken as string))

    return res.status(200).json({ ok: true, data: { botToken, channelSignalId, channels} })
}