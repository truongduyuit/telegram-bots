import type { NextApiRequest, NextApiResponse } from 'next'
// import { cache } from 'server/cache'

type Data = {
    ok: boolean,
    data: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token } = req.query

    // console.log("ahihi: ",await cache.get(token as string))

    return res.status(200).json({ ok: true, data: req.body })
}