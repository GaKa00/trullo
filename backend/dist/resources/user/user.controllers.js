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
exports.register = register;
exports.login = login;
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.removePassword = removePassword;
exports.changePassword = changePassword;
exports.adminLevelUpdate = adminLevelUpdate;
exports.deleteAllUsers = deleteAllUsers;
const models_js_1 = require("../../db/models.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const createjwt_js_1 = require("../../utils/createjwt.js");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, roleKey } = req.body;
        try {
            const existingUser = yield models_js_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const newUser = new models_js_1.User({ name, email, password });
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
            yield newUser.save();
            const token = (0, createjwt_js_1.generateToken)(newUser);
            return res.status(201).json({ user: newUser, token });
        }
        catch (error) {
            console.error("Error during registration:", error);
            return res
                .status(500)
                .json({ message: "Server error", error: error.message });
        }
    });
}
// log in a user
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Find the user by email
            const user = yield models_js_1.User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            // Check if the password matches
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            // Generate and return JWT token
            const token = (0, createjwt_js_1.generateToken)(user);
            res.status(200).json({ user, token });
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    });
}
//create a newuser and assign user role
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, roleKey } = req.body;
        // Explicitly define the shape of the user data
        const userData = {
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
            const user = yield models_js_1.User.create(userData);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
//get All users
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield models_js_1.User.find();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
//delete a user
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield models_js_1.User.findByIdAndDelete(id);
            return res.status(200).json({ message: `User deleted: ${user}` });
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
//update a user
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { name, email, password } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userData = {};
        if (name !== undefined)
            userData.name = name;
        if (email !== undefined)
            userData.email = email;
        if (password !== undefined)
            userData.password = password;
        try {
            const user = yield models_js_1.User.findByIdAndUpdate(id, userData, { new: true });
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
function removePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield models_js_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.password = "";
            yield user.save();
            return res.status(200).json({ message: "Password removed successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { currentPassword, newPassword } = req.body;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const user = yield models_js_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!currentPassword) {
                return res
                    .status(400)
                    .json({ message: "Your Current password is required" });
            }
            const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (!newPassword || newPassword.length < 6) {
                return res
                    .status(400)
                    .json({ message: "New password must be at least 6 characters" });
            }
            user.password = newPassword;
            yield user.save();
            return res.status(200).json({ message: "Password changed successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    });
}
function adminLevelUpdate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { id, name, email, password, project } = req.body;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            if (!userId) {
                return res.status(401).json({ message: "Not logged in." });
            }
            if (userRole !== "admin") {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userData = { name, email, password, project };
            const user = yield models_js_1.User.findByIdAndUpdate(id, userData, { new: true });
            res.status(200).json(user);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        }
        catch (error) {
            console.error("Error updating user:", error);
            res
                .status(500)
                .json({ message: "Server error", error: error.message || error });
        }
    });
}
function deleteAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield models_js_1.User.deleteMany({}); // Delete all users
            res
                .status(200)
                .json({ message: `${result.deletedCount} users deleted successfully` });
        }
        catch (error) {
            console.error("Error deleting users:", error);
            res
                .status(500)
                .json({ message: "Server error", error: error.message || error });
        }
    });
}
