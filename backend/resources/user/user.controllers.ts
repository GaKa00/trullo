
import { User, UserDocument } from "../../db/models.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import {generateToken} from "../../utils/createjwt.js"
import {Request, Response} from "express"

import {UserUpdateData, UserCreationData, ExtendedRequest } from "../../types/types.js"


interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string; 
    roleKey: string;
    
  };
}
interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}




export async function register(req: ExtendedRequest, res: Response) {
  
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, roleKey } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, });

    switch (roleKey) {
      case "TruMinadexe":
        newUser.role = "admin";
        break;
      case "TruLPexe":
        newUser.role = "project_leader";
        break;
      default:
        newUser.role = "developer";
    }

    await newUser.save();

    const token = generateToken(newUser);
    return res.status(201).json({ user: newUser, token });
  } catch (error: any) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// log in a user
export async function login(req: LoginRequest, res: Response) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate and return JWT token
    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
//create a newuser and assign user role
export async function createUser(req: Request, res: Response) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { name, email, password, roleKey } = req.body;

  // Explicitly define the shape of the user data
  const userData: UserCreationData = {
    name,
    email,
    password,
    role: "developer", // Set a default value
  };

  // Adjust the role based on the roleKey
  switch (roleKey) {
    case "TruMinadexe":
      userData.role = "admin";
      break;
    case "TruLPexe":
      userData.role = "project_leader";
      break;
  }

  try {
    // Create the user using the correct data type
    const user = await User.create(userData);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}


//get All users
export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

 //delete a user
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: `User deleted: ${user}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}


//update a user
export async function updateUser(req: ExtendedRequest, res: Response) {
  
    const { id } = req.params;
    const { name, email, password } = req.body;


  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

 const userData: UserUpdateData = {};

 if (name !== undefined) userData.name = name;
 if (email !== undefined) userData.email = email;
 if (password !== undefined) userData.password = password;

  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}



export async function removePassword(req: ExtendedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = "";
    await user.save();

    return res.status(200).json({ message: "Password removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

export async function changePassword(req: ExtendedRequest, res: Response) {
  const { currentPassword, newPassword } = req.body;

  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     if(!currentPassword) {
         return res
           .status(400)
           .json({ message: "Your Current password is required" });
     }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}



export async function adminLevelUpdate(req: ExtendedRequest, res: Response) {
  const { id, name, email, password, project } = req.body;

  try {
  


    if (!req.user?.id) {
      return res.status(401).json({ message: "Not logged in." });
    }
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = { name, email, password, project };
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    res.status(200).json(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
}


export async function deleteAllUsers(req: Request, res: Response) {
  try {
    const result = await User.deleteMany({}); // Delete all users
    res
      .status(200)
      .json({ message: `${result.deletedCount} users deleted successfully` });
  } catch (error : any) {
    console.error("Error deleting users:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
}


