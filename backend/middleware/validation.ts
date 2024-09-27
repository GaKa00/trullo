import { body, param } from "express-validator";
import mongoose from "mongoose";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("roleKey")
    .optional()
    .isIn(["TruMinadexe", "TruLPexe"])
    .withMessage("Invalid role key"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const createValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("roleKey")
    .optional()
    .isIn(["TruMinadexe", "TruLPexe"])
    .withMessage("Invalid role key"),
];

export const deleteValidation = [
    param("id")
        .isMongoId() 
        .withMessage("Invalid user ID"),
]

export const updateValidation = [ 
    body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
     param("id")
        .isMongoId() 
        .withMessage("Invalid user ID"),]


        export const adminValidation = [
  body("id")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid ID");
      }
      return true;
    }),
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name is required and should be a non-empty string"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("project")
    .optional()
    .isArray()
    .withMessage("Projects must be an array of ObjectIds")
    .custom((projects) => {
      // Ensure each project ID is valid
      for (let projectId of projects) {
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
          throw new Error(`Invalid project ID: ${projectId}`);
        }
      }
      return true;
    }),
];



export const validateTaskCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("status").notEmpty().withMessage("Status is required"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
];

export const validateTaskUpdate = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("status").optional().isString(),
  body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
];

export const validateTaskDeletion = [
  param("id").isMongoId().withMessage("Invalid task ID"),
];

export const validateTaskAssignment = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID for assignment"),
];




