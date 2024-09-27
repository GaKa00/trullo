import jwt from "jsonwebtoken";
import { UserDocument } from "../db/models";
import "dotenv/config";

// Generate JWT Token
export const generateToken = (user: UserDocument) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "1d",
  });
};
