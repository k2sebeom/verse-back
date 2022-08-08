import { Server } from 'socket.io';
import { JoinRequest } from '../@types/models/socket/SocketDTO';


export default async (io: Server) => {
    io.on('connection', (socket) => {
      console.log(`${socket.id} connected`);

      socket.on('join', (id: string, data: JoinRequest) => {
        socket.join(id);
        console.log(`${socket.id} joined room ${id}`);
        console.log(data);

        io.to(id).emit('join', data);

        socket.on('msg', (data) => {
          socket.broadcast.to(id).emit('msg', data);
        });

        socket.on('disconnect', (reason) => {
          console.log(`${socket.id} disconnected`);
        })
      })
    });
};
