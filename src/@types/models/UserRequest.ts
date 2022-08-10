import { Request } from "express";


interface GetMusicianRequest extends Request {
    params: {
        id: string
    }
}

interface GetRtcTokenRequest extends Request {
    params: {
        channelName: string,
        account: string
    }
}

export type {
    GetMusicianRequest,
    GetRtcTokenRequest
}