import { Request, Response } from "express";




import {Task} from "../../db/models.js";
import { ExtendedRequest } from "../../types/types.js";



//create new task
export async function createTask(req:Request, res:Response) {
    const { title, description, status, assignedTo } = req.body;
    const task = new Task({ title, description, status, assignedTo });
    await task.save();
    res.status(201).json(task);
}


// get all tasks
export async function getTasks(req: Request, res: Response) {
  const tasks = await Task.find();
  res.status(200).json(tasks);
}


//update a task
export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, status, assignedTo } = req.body;
  const task = await Task.findByIdAndUpdate(id, {
    title,
    description,
    status,
    assignedTo,
  });
  res.status(200).json(task);
}

//delete a task
export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  res.status(200).json(task);
}

//assign Task
export async function assignTask(req: ExtendedRequest, res: Response) {
  const { id } = req.params;
  const { assignedTo } = req.body;

  // Get the logged-in user's ID and role from req.user
  const loggedInUserId = req.user?.id;
  const userRole = req.user?.role;

  try {
    // Check if the task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Determine who the task should be assigned to
    let assignToUserId;
    if (userRole === "admin" || userRole === "project_leader") {
      if (assignedTo) {
        assignToUserId = assignedTo;
      } else {
        return res
          .status(400)
          .json({ message: "missing parameter: assignedTo" });
      }
    } else if (userRole === "developer") {
      // Regular users can only assign the task to themselves
      assignToUserId = loggedInUserId;
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to assign this task" });
    }

    // Update the task's assignedTo field
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { assignedTo: assignToUserId },
      { new: true } // Return the updated task
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteAllTasks(req: Request, res: Response) {
  try {
    const result = await Task.deleteMany({}); // Delete all tasks
    res
      .status(200)
      .json({ message:`${result.deletedCount} tasks deleted successfully` });
  } catch (error: any) {
    console.error("Error deleting tasks:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
}