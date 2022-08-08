import { Service } from 'typedi';
import db from '../utils/db';
import { Player } from '../@types/Room';
import e = require('express');


@Service()
export default class RoomService {
    public rooms: {[id: number]: {[pid: number]: Player}}

    constructor() {
        this.rooms = {};
    }

    public addPlayer(roomId: number, player: Player) {
        if(this.rooms[roomId]) {
            this.rooms[roomId][player.id] = player;
        }
        else {
            this.rooms[roomId] = { [player.id]: player};
        }
    }

    public updatePlayer(roomId: number, playerId: string, pos: number[]) {
        if(this.rooms[roomId]) {
            this.rooms[roomId][playerId].pos = pos;
        }
    }

    public removePlayer(roomId: number, playerId: string) {
        if(this.rooms[roomId]) {
            delete this.rooms[roomId][playerId];
        }
    }
}