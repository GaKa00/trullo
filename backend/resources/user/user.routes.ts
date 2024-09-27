import express from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  register,
  login,
  deleteAllUsers,
  adminLevelUpdate,
  
} from "./user.controllers.js"; 

import { registerValidation, loginValidation, createValidation, deleteValidation, updateValidation,adminValidation } from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();
// register User
router.post("/register", registerValidation, register);

// User login
router.post('/login', loginValidation, login);

// Route to create a new user
router.post("/users", createValidation,  createUser);

// Route to get all users
router.get("/users",  getUsers);

// Route to delete a user by ID
router.delete("/users/:id", deleteValidation, deleteUser);

// Route to delete all users
router.delete("/users", deleteAllUsers);

// Route to update a user by ID
router.put("/users/:id", updateValidation, updateUser);

router.put("users/admin", adminValidation, protect, adminLevelUpdate);

export default router;
