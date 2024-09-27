"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controllers_js_1 = require("./task.controllers.js");
const auth_js_1 = require("../../middleware/auth.js");
const validation_js_1 = require("../../middleware/validation.js");
const router = express_1.default.Router();
// Route to create a new task
router.post("/tasks", validation_js_1.validateTaskCreation, task_controllers_js_1.createTask);
// Route to get all tasks
router.get("/tasks", task_controllers_js_1.getTasks);
// Route to update a task by ID
router.put("/tasks/:id", task_controllers_js_1.updateTask);
// Route to delete a task by ID
router.delete("/tasks/:id", task_controllers_js_1.deleteTask);
// Route to delete all tasks
router.delete('/tasks', task_controllers_js_1.deleteAllTasks);
// Route to assign a task (based on role)
router.put("/tasks/:id/assign", auth_js_1.protect, task_controllers_js_1.assignTask);
exports.default = router;
