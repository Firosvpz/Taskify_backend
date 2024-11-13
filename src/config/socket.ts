import { Server as SocketIOServer } from "socket.io";
import http from "http";
import jwt from 'jsonwebtoken';

const initializeSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "https://taskify-frontend-nine.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.use((socket,next)=>{
    const token = socket.handshake.auth.token
    

    if(!token){
      return next(new Error("Authentication error: Token required"));
    }

    try {
      const decodedToken = jwt.verify(token,process.env.JWT_SECRET as string) as jwt.JwtPayload
      socket.data.userId = decodedToken.userId
      next()
      
    } catch (error) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  })

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on('join',()=>{
      const userId = socket.data.userId
      console.log(`user ${userId} joined their room`);
      socket.join(userId)
      
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default initializeSocket;
