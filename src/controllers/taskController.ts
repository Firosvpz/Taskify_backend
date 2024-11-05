import { Request, Response } from "express";
import Task from "../models/taskModel";
import { Server as SocketIOServer } from 'socket.io';

interface AuthRequest extends Request {
    userId?: string;
}
let io : SocketIOServer 

export const setSocketServerInstance = (socketInstance:SocketIOServer)=>{
    io = socketInstance
}
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId
        const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })
        res.status(200).json( tasks)
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const createTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        
        const tasks = new Task({
            ...req.body,
            user: req.userId
        })
        console.log('task', tasks);
        await tasks.save()
        io.emit('taskCreated',tasks)
        res.status(200).json({ success: true, tasks })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id
        const { title } = req.body

        const tasks= await Task.findByIdAndUpdate(id, title, { new: true })
        console.log('updatedtask', tasks);
        io.emit('taskUpdated', tasks)
        res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        res.status(500).json({ message: "An error occured while updating task" })
    }
}

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId:req.userId },
      { status: 'completed' }, 
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    io.emit('taskCompleted', task); // Emit the event to all clients
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const tasks = await Task.findByIdAndDelete({_id:id,userId})
        console.log('deletedtask', deletedTask);
        io.emit('taskDeleted',tasks._id)
        res.status(200).json({success:true, message: "Task deleted successfullyyyy" })
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting a task" })
    }
}




