"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.assignTask = assignTask;
exports.deleteAllTasks = deleteAllTasks;
const models_js_1 = require("../../db/models.js");
//create new task
function createTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, status, assignedTo } = req.body;
        const task = new models_js_1.Task({ title, description, status, assignedTo });
        yield task.save();
        res.status(201).json(task);
    });
}
// get all tasks
function getTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasks = yield models_js_1.Task.find();
        res.status(200).json(tasks);
    });
}
//update a task
function updateTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { title, description, status, assignedTo } = req.body;
        const task = yield models_js_1.Task.findByIdAndUpdate(id, {
            title,
            description,
            status,
            assignedTo,
        });
        res.status(200).json(task);
    });
}
//delete a task
function deleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const task = yield models_js_1.Task.findByIdAndDelete(id);
        res.status(200).json(task);
    });
}
//assign Task
function assignTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { id } = req.params;
        const { assignedTo } = req.body;
        // Get the logged-in user's ID and role from req.user
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        try {
            // Check if the task exists
            const task = yield models_js_1.Task.findById(id);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            // Determine who the task should be assigned to
            let assignToUserId;
            if (userRole === "admin" || userRole === "project_leader") {
                if (assignedTo) {
                    assignToUserId = assignedTo;
                }
                else {
                    return res
                        .status(400)
                        .json({ message: "missing parameter: assignedTo" });
                }
            }
            else if (userRole === "developer") {
                // Regular users can only assign the task to themselves
                assignToUserId = loggedInUserId;
            }
            else {
                return res
                    .status(403)
                    .json({ message: "You are not authorized to assign this task" });
            }
            // Update the task's assignedTo field
            const updatedTask = yield models_js_1.Task.findByIdAndUpdate(id, { assignedTo: assignToUserId }, { new: true } // Return the updated task
            );
            res.status(200).json(updatedTask);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
}
function deleteAllTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield models_js_1.Task.deleteMany({}); // Delete all tasks
            res
                .status(200)
                .json({ message: `${result.deletedCount} tasks deleted successfully` });
        }
        catch (error) {
            console.error("Error deleting tasks:", error);
            res
                .status(500)
                .json({ message: "Server error", error: error.message || error });
        }
    });
}
