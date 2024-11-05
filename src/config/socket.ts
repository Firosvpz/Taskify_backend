import { Server as SocketIOServer } from 'socket.io'; 
import http from 'http';

const initializeSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173', // Ensure this matches your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io
  
};

export default initializeSocket;
