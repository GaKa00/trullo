import { Request } from "express";
import { UserDocument } from "../db/models";
import { Types } from "mongoose";

 export interface UserCreationData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "project_leader" | "developer";
}

 export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
}


 export interface ExtendedRequest extends Request {
   body: {
     name?: string;
     email?: string;
     password?: string;
     roleKey?: string;
     currentPassword?: string;
     newPassword?: string;
     assignedTo?: string;
     id?: Types.ObjectId; 
     project?: Types.ObjectId[];
   };
   user?: UserDocument;
 };
