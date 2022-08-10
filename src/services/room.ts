import { Service } from 'typedi';
import { Player } from '../@types/Room';


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

    public setPlayerName(roomId: number, playerId: string, nickname: string) {
        if(this.rooms[roomId]) {
            this.rooms[roomId][playerId].nickname = nickname;
        }
    }

    public setPlayerToken(roomId: number, playerId: string, tokenId: number) {
        if(this.rooms[roomId]) {
            this.rooms[roomId][playerId].tokenId = tokenId;
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