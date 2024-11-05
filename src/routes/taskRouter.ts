import express from "express";
import { createTasks, getTasks,updateTask,deleteTask,completeTask } from "../controllers/taskController";
import userAuth from "../middlewares/userAuth";

const taskRouter = express.Router()

taskRouter.get('/tasks',userAuth,getTasks)

taskRouter.post('/create-task',userAuth,createTasks)

taskRouter.put('/update-task/:id',userAuth,updateTask)

taskRouter.patch('/complete-task/:id',userAuth,completeTask)

taskRouter.delete('/delete-task/:id',userAuth,deleteTask)

export default taskRouter