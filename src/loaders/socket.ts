import { Server } from 'socket.io';
import Container from 'typedi';
import { JoinRequest } from '../@types/models/socket/SocketDTO';
import RoomService from '../services/room';


export default async (io: Server) => {
    io.on('connection', (socket) => {
      console.log(`${socket.id} connected`);

      socket.on('join', (id: string, data: JoinRequest) => {
        socket.join(id);
        console.log(`${socket.id} joined room ${id}`);

        const roomService = Container.get(RoomService);
        roomService.addPlayer(parseInt(id), { ...data, id: socket.id });

        socket.emit('members', {
          id: socket.id,
          members: Object.values(roomService.rooms[id])
        });

        socket.broadcast.to(id).emit('join', { ...data, id: socket.id });

        socket.on('msg', (data) => {
          socket.broadcast.to(id).emit('msg', data);
        });

        socket.on('transform', (data) => {
          socket.broadcast.to(id).emit('transform', { ...data, id: socket.id });
          roomService.updatePlayer(parseInt(id), socket.id, data.pos);
        });

        socket.on('name', (data) => {
          roomService.setPlayerName(parseInt(id), socket.id, data);
          socket.broadcast.to(id).emit('name', {
            id: socket.id,
            name: data
          });
        });

        socket.on('disconnect', (reason) => {
          console.log(`${socket.id} disconnected`);
          roomService.removePlayer(parseInt(id), socket.id);
          io.to(id).emit('leave', {
            id: socket.id
          })
        })
      })
    });
};
