import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/models.js";
import "dotenv/config";
import  {ExtendedRequest} from "../types/types.js"

// Define an interface for the decoded token payload
interface DecodedToken {
  id: string;
}

// Middleware to protect routes
export async function protect(req: ExtendedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  // Check if the token is present in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      // Attach the user to the request, including the role field
      req.user = await User.findById(decoded.id).select("-password role");

      // Log req.user to verify it contains role and other necessary data
      console.log("Authenticated user:", req.user);

      // Proceed to the next middleware or route handler
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
}
