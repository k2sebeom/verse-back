import { Request } from "express";


interface GetMusicianRequest extends Request {
    params: {
        id: string
    }
}

export type {
    GetMusicianRequest
}