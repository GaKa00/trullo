"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskGet = exports.validateTaskAssignment = exports.validateTaskDeletion = exports.validateTaskUpdate = exports.validateTaskCreation = exports.adminValidation = exports.updateValidation = exports.deleteValidation = exports.createValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.registerValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("roleKey")
        .optional()
        .isIn(["TruMinadexe", "TruLPexe"])
        .withMessage("Invalid role key"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.createValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("roleKey")
        .optional()
        .isIn(["TruMinadexe", "TruLPexe"])
        .withMessage("Invalid role key"),
];
exports.deleteValidation = [
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid user ID"),
];
exports.updateValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.param)("id")
        .isMongoId()
        .withMessage("Invalid user ID"),
];
exports.adminValidation = [
    (0, express_validator_1.body)("id")
        .optional()
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error("Invalid ID");
        }
        return true;
    }),
    (0, express_validator_1.body)("name")
        .isString()
        .notEmpty()
        .withMessage("Name is required and should be a non-empty string"),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("project")
        .optional()
        .isArray()
        .withMessage("Projects must be an array of ObjectIds")
        .custom((projects) => {
        // Ensure each project ID is valid
        for (let projectId of projects) {
            if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                throw new Error(`Invalid project ID: ${projectId}`);
            }
        }
        return true;
    }),
];
exports.validateTaskCreation = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").optional().isString(),
    (0, express_validator_1.body)("status").notEmpty().withMessage("Status is required"),
    (0, express_validator_1.body)("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
];
exports.validateTaskUpdate = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID"),
    (0, express_validator_1.body)("title").optional().isString(),
    (0, express_validator_1.body)("description").optional().isString(),
    (0, express_validator_1.body)("status").optional().isString(),
    (0, express_validator_1.body)("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
];
exports.validateTaskDeletion = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID"),
];
exports.validateTaskAssignment = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID"),
    (0, express_validator_1.body)("assignedTo")
        .optional()
        .isMongoId()
        .withMessage("Invalid user ID for assignment"),
];
exports.validateTaskGet = [
    (0, express_validator_1.param)("id").optional().isMongoId().withMessage("Invalid task ID"),
];
