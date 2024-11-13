import { Request, Response } from "express";
import Task from "../models/taskModel";
import { Server as SocketIOServer } from "socket.io";

interface AuthRequest extends Request {
  userId?: string;
}
let io: SocketIOServer;

export const setSocketServerInstance = (socketInstance: SocketIOServer) => {
  io = socketInstance;
};
export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const createTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title } = req.body;
    const tasks = new Task({
      title,
      user: req.userId,
    });
    // console.log('task', tasks);
    await tasks.save();
    io.to(req.userId!).emit("taskCreated", tasks);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const { title, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, status },
      { new: true },
    );
    // console.log('updatedtask', updatedTask);
    io.to(req.userId!).emit("taskUpdated", updatedTask);
    res.status(200).json({
      success: true,
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured while updating task" });
  }
};

export const completeTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const task = await Task.findOneAndUpdate(
      { _id: id },
      { status: "completed" },
      { new: true },
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    io.to(req.userId!).emit("taskCompleted", task); // Emit the event to all clients
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    // console.log('deletedtask', deletedTask);
    io.to(req.userId!).emit("taskDeleted", id);
    res
      .status(200)
      .json({
        success: true,
        message: "Task deleted successfullyyyy",
        deletedTask,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting a task" });
  }
};

export const serachTask = async (req:Request,res:Response)=>{
  try {
    const searchQuery = req.query.query as string;
    const tasks = await Task.find({
      title:{$regex:searchQuery,$options:'i'}
    })
    res.json({success:true,tasks})
  } catch (error) {
    console.error("Error searching tasks:", error);
    res.status(500).json({ success: false, message: "Error searching tasks" });
  }
}
