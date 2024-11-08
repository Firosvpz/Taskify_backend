import express from "express";
import http from 'http';
import dotenv from "dotenv";
import cors from "cors";
// import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import router from "./routes/authRoutes";
import taskRouter from "./routes/taskRouter";
import initializeSocket from "./config/socket";
import { setSocketServerInstance } from "./controllers/taskController";


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

setSocketServerInstance(io)

const PORT = process.env.PORT || 3000;

connectDB();

// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://taskify-frontend-one.vercel.app"],
    methods: "GET,PUT,POST,PATCH,DELETE",
    credentials: true,
  }),
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.use("/api/user", router);
app.use("/api/task", taskRouter);



server.listen(PORT, () => {
  console.log(`Database connected successfully on https://taskify-frontend-xi.vercel.app`);
});
