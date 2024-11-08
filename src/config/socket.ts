import { Server as SocketIOServer } from 'socket.io'; 
import http from 'http';

const initializeSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'https://taskify-frontend-one.vercel.app', 
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    socket.on('join',(userId:string)=>{
        console.log(`User ${userId} joined the room`);
        socket.join(userId)
    })
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io
  
};

export default initializeSocket;
