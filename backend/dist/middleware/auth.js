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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_js_1 = require("../db/models.js");
require("dotenv/config");
// Middleware to protect routes
function protect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        // Check if the token is present in the authorization header
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            try {
                // Get the token from the header
                token = req.headers.authorization.split(" ")[1];
                // Verify the token
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                // Attach the user to the request
                req.user = yield models_js_1.User.findById(decoded.id).select("-password");
                // Proceed to the next middleware or route handler
                return next();
            }
            catch (error) {
                res.status(401).json({ message: "Not authorized, token failed" });
            }
        }
        if (!token) {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    });
}
