import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/models.js";
import "dotenv/config";
import  {ExtendedRequest} from "../types/types.js"

// Define an interface for the decoded token payload
interface DecodedToken {
  id: string;
}
export async function protect(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      console.log("Decoded token:", decoded);

      // Attach the user to the request, including the role field
   req.user = await User.findById(decoded.id).select("-password");

      console.log("User found:", req.user);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Proceed to the next middleware or route handler
      return next();
    } catch (error) {
      console.error(
        "Error during token verification or user retrieval:",
        error
      );
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
}