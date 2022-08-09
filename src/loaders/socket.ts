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

        socket.emit('id', socket.id);

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

        socket.on('perform', (data) => {
          setTimeout(() => {
            socket.broadcast.to(id).emit('perform', { state: data, id: socket.id });
          }, 20000);
        });

        socket.on('reaction', (data) => {
          socket.broadcast.to(id).emit('reaction', { ...data, id: socket.id });
        });

        socket.on('leave', (socketId) => {
          roomService.removePlayer(parseInt(id), socketId);
          io.to(id).emit('leave', {
            id: socketId
          })
        })

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
