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
        const pendingTasks = await Task.find({user:userId},{status:"pending"}) 
        const completedTasks = await Task.find({user:userId},{status:"completed"})
        res.status(200).json({ tasks,pendingTasks,completedTasks })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const createTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title } = req.body
        const tasks = new Task({
            title,
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
        const { title, status } = req.body

        const updatedTask = await Task.findByIdAndUpdate(id, { title, status }, { new: true })
        console.log('updatedtask', updatedTask);
        io.emit('taskUpdated',updatedTask)
        res.status(200).json({
            success: true,
            updatedTask
        })
    } catch (error) {
        res.status(500).json({ message: "An error occured while updating task" })
    }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const deletedTask = await Task.findByIdAndDelete(id)
        console.log('deletedtask', deletedTask);
        io.emit('taskDeleted',id)
        res.status(200).json({success:true, message: "Task deleted successfullyyyy" ,deletedTask})
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting a task" })
    }
}




