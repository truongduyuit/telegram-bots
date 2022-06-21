import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AlertChannelState {
    channels: {
        id: string,
        alertDelay: string,
        randomId: string
    }[]
}

const initialState: AlertChannelState = {
    channels: []
}

export const appSlice = createSlice({
    name: "AlertChannels",
    initialState,
    reducers: {
        setAlertChannels: (state, action: PayloadAction<{
            id: string,
            alertDelay: string
            randomId: string
        }[]>
        ) => {
            state.channels = action.payload
        }
    },
})

export const { setAlertChannels } =
    appSlice.actions

export default appSlice.reducer
