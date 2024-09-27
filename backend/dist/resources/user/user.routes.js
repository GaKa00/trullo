"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_js_1 = require("./user.controllers.js");
const router = express_1.default.Router();
// register User
router.post("/register", user_controllers_js_1.register);
// User login
router.post('/login', user_controllers_js_1.login);
// Route to create a new user
router.post("/users", user_controllers_js_1.createUser);
// Route to get all users
router.get("/users", user_controllers_js_1.getUsers);
// Route to delete a user by ID
router.delete("/users/:id", user_controllers_js_1.deleteUser);
// Route to delete all users
router.delete("/users", user_controllers_js_1.deleteAllUsers);
// Route to update a user by ID
router.put("/users/:id", user_controllers_js_1.updateUser);
exports.default = router;
