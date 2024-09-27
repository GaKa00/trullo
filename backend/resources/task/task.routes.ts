import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
  deleteAllTasks,
} from "./task.controllers.js"; 
import { protect } from "../../middleware/auth.js";
import { validateTaskCreation, validateTaskAssignment, validateTaskDeletion, validateTaskUpdate,  } from "../../middleware/validation.js";


const router = express.Router();

// Route to create a new task
router.post("/tasks", validateTaskCreation , createTask);

// Route to get all tasks
router.get("/tasks", getTasks);

// Route to update a task by ID
router.put("/tasks/:id", validateTaskUpdate , updateTask);

// Route to delete a task by ID
router.delete("/tasks/:id", validateTaskDeletion, deleteTask);

// Route to delete all tasks
router.delete('/tasks', deleteAllTasks);

// Route to assign a task (based on role)
router.put("/tasks/:id/assign", protect, validateTaskAssignment, assignTask);

export default router;
