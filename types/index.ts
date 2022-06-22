export type CHANNEL_ALERT_TYPE = {
    [key: string]: {
        id: string,
        alertDelay: string
    }
}

export type CHANNEL_SIGNAL_TYPE = {
    channelId: string,
    createdAt: number,
    message: string
}