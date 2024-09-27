import mongoose  from "mongoose";
import { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface TaskDocument extends Document {
  title: string;
  description?: string; 
  status: "to-do" | "in progress" | "reviewing" | "done"; 
  assignedTo?: mongoose.Types.ObjectId; 
  createdAt: Date;
  finishedBy?: Date; 
  project: mongoose.Types.ObjectId; 
}


const taskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["to-do", "in progress", "reviewing", "done"],
    default: "to-do",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  finishedBy: {
    type: Date,
  },
  project: {
    
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", 
    required: true, 
  },
});

export const Task = mongoose.model("Task", taskSchema);





export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "project_leader" | "developer";
  projects: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "project_leader", "developer"],
    required: true,
  },
  projects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
});



userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
})

export const User = mongoose.model("User", userSchema);


const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", 
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 export const Project = mongoose.model("Project", projectSchema);

