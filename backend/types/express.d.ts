import { UserDocument } from "../db/models.ts"

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; 
    }
  }
}
